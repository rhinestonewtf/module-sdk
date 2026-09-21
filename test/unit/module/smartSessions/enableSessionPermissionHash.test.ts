import { Address, Hex, isAddressEqual, toBytes, toHex } from 'viem'
import { sepolia } from 'viem/chains'
import {
  ActionData,
  ChainSession,
  Session,
  SmartSessionMode,
} from 'src/module/smart-sessions/types'
import {
  deriveSignedSessionPermissionFlags,
  getEnableSessionDetails,
  hashChainSessions,
} from 'src/module/smart-sessions/usage'
import { GLOBAL_CONSTANTS } from 'src/constants'
import { MockSafeAccountDeployed } from 'test/utils/mocks/account'

/**
 * `permissionEnableHash` must match exactly what `SmartSession.enableSessions`
 * / `onInstall` verify on-chain. `HashLib.sol` derives three of the seven
 * `SignedPermissions` fields itself - `permitGenericPolicy`, `permitAdminAccess`
 * (both from the session's own `actions`), and `ignoreSecurityAttestations`
 * (from whether `mode == UNSAFE_ENABLE`) - it never accepts them as caller
 * input. `getEnableSessionDetails` used to accept all three as free params
 * defaulting to `false`, so the hash it returned diverged from the contract's
 * the moment any of those three true on-chain values differed from `false`.
 *
 * These expectations are derived FRESH from `HashLib.sol`'s actual rule
 * (mode/action-based), not by importing or re-using `getEnableSessionDetails`'
 * own struct-building - reusing that code would repeat the exact mistake
 * that let this bug ship untested (see PR body / round-11 scouting report).
 */

const FALLBACK_TARGET = GLOBAL_CONSTANTS.SMART_SESSIONS_FALLBACK_TARGET_FLAG
const GENERIC_POLICY_SELECTOR =
  GLOBAL_CONSTANTS.SMART_SESSIONS_FALLBACK_TARGET_SELECTOR_FLAG
const ADMIN_ACCESS_SELECTOR =
  GLOBAL_CONSTANTS.SMART_SESSIONS_FALLBACK_TARGET_SELECTOR_FLAG_PERMITTED_TO_CALL_SMARTSESSION

// A fresh, independent EIP-712 hash of one ChainSession, built directly from
// the on-chain rule rather than through getEnableSessionDetails.
const expectedPermissionEnableHash = ({
  session,
  account,
  smartSession,
  nonce,
  mode,
}: {
  session: Session
  account: Address
  smartSession: Address
  nonce: bigint
  mode: Hex
}): Hex => {
  const ignoreSecurityAttestations = mode === SmartSessionMode.UNSAFE_ENABLE

  let permitGenericPolicy = false
  let permitAdminAccess = false
  for (const action of session.actions) {
    if (!isAddressEqual(action.actionTarget, FALLBACK_TARGET)) continue
    if (
      action.actionTargetSelector.toLowerCase() ===
      GENERIC_POLICY_SELECTOR.toLowerCase()
    )
      permitGenericPolicy = true
    if (
      action.actionTargetSelector.toLowerCase() ===
      ADMIN_ACCESS_SELECTOR.toLowerCase()
    )
      permitAdminAccess = true
  }

  const chainSessions: ChainSession[] = [
    {
      chainId: session.chainId,
      session: {
        ...session,
        permissions: {
          permitGenericPolicy,
          permitAdminAccess,
          ignoreSecurityAttestations,
          permitERC4337Paymaster: session.permitERC4337Paymaster,
          userOpPolicies: session.userOpPolicies,
          erc7739Policies: session.erc7739Policies,
          actions: session.actions,
        },
        account,
        smartSession,
        nonce,
      },
    },
  ]

  return hashChainSessions(chainSessions)
}

describe('getEnableSessionDetails permissionEnableHash', () => {
  const account = MockSafeAccountDeployed
  const plainSession: Session = {
    sessionValidator: '0x000000000000000000000000000000000000dEaD',
    sessionValidatorInitData: '0x',
    salt: toHex(toBytes('enable-hash-test', { size: 32 })),
    userOpPolicies: [],
    actions: [
      {
        actionTarget: '0x000000000000000000000000000000000000cafE',
        actionTargetSelector: '0x12345678' as Hex,
        actionPolicies: [],
      },
    ],
    erc7739Policies: { allowedERC7739Content: [], erc1271Policies: [] },
    permitERC4337Paymaster: false,
    chainId: BigInt(sepolia.id),
  }

  const NONCE = 0n
  const SESSION_DIGEST = '0x' + '11'.repeat(32)

  const makeFakeClient = () =>
    ({
      chain: { id: sepolia.id },
      readContract: jest.fn(
        async ({ functionName }: { functionName: string }) => {
          if (functionName === 'getNonce') return NONCE
          if (functionName === 'getSessionDigest') return SESSION_DIGEST
          throw new Error(`unexpected readContract call: ${functionName}`)
        },
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any

  it('case A (control): plain session, mode=ENABLE - flags all false, hash matches a correct baseline', async () => {
    const details = await getEnableSessionDetails({
      sessions: [plainSession],
      account,
      clients: [makeFakeClient()],
      enableMode: SmartSessionMode.ENABLE,
      sessionNonces: [NONCE],
    })

    const expected = expectedPermissionEnableHash({
      session: plainSession,
      account: account.address,
      smartSession: GLOBAL_CONSTANTS.SMART_SESSIONS_ADDRESS,
      nonce: NONCE,
      mode: SmartSessionMode.ENABLE,
    })

    expect(details.permissionEnableHash).toEqual(expected)
  })

  it('case B: identical plain session but mode=UNSAFE_ENABLE - hash must differ from case A and match the mode-aware expectation', async () => {
    const enableDetails = await getEnableSessionDetails({
      sessions: [plainSession],
      account,
      clients: [makeFakeClient()],
      enableMode: SmartSessionMode.ENABLE,
      sessionNonces: [NONCE],
    })

    const unsafeEnableDetails = await getEnableSessionDetails({
      sessions: [plainSession],
      account,
      clients: [makeFakeClient()],
      enableMode: SmartSessionMode.UNSAFE_ENABLE,
      sessionNonces: [NONCE],
    })

    // This is the headline regression: pre-fix, the SDK returned the SAME
    // hash for ENABLE and UNSAFE_ENABLE because ignoreSecurityAttestations
    // was always the caller-supplied default (false), never mode-derived.
    expect(unsafeEnableDetails.permissionEnableHash).not.toEqual(
      enableDetails.permissionEnableHash,
    )

    const expected = expectedPermissionEnableHash({
      session: plainSession,
      account: account.address,
      smartSession: GLOBAL_CONSTANTS.SMART_SESSIONS_ADDRESS,
      nonce: NONCE,
      mode: SmartSessionMode.UNSAFE_ENABLE,
    })

    expect(unsafeEnableDetails.permissionEnableHash).toEqual(expected)
  })

  it('case C: a fallback action policy - permitGenericPolicy/permitAdminAccess must be derived from actions, not defaulted to false', async () => {
    const sessionWithFallback: Session = {
      ...plainSession,
      actions: [
        ...plainSession.actions,
        {
          actionTarget: GLOBAL_CONSTANTS.SMART_SESSIONS_FALLBACK_TARGET_FLAG,
          actionTargetSelector:
            GLOBAL_CONSTANTS.SMART_SESSIONS_FALLBACK_TARGET_SELECTOR_FLAG,
          actionPolicies: [],
        } as ActionData,
      ],
    }

    const details = await getEnableSessionDetails({
      sessions: [sessionWithFallback],
      account,
      clients: [makeFakeClient()],
      enableMode: SmartSessionMode.ENABLE,
      sessionNonces: [NONCE],
    })

    const expected = expectedPermissionEnableHash({
      session: sessionWithFallback,
      account: account.address,
      smartSession: GLOBAL_CONSTANTS.SMART_SESSIONS_ADDRESS,
      nonce: NONCE,
      mode: SmartSessionMode.ENABLE,
    })

    expect(details.permissionEnableHash).toEqual(expected)

    // A hash computed with both flags forced false (the pre-fix default)
    // must NOT match - proving the fallback action actually moved the hash.
    const wrongExpected = hashChainSessions([
      {
        chainId: sessionWithFallback.chainId,
        session: {
          ...sessionWithFallback,
          permissions: {
            permitGenericPolicy: false,
            permitAdminAccess: false,
            ignoreSecurityAttestations: false,
            permitERC4337Paymaster: sessionWithFallback.permitERC4337Paymaster,
            userOpPolicies: sessionWithFallback.userOpPolicies,
            erc7739Policies: sessionWithFallback.erc7739Policies,
            actions: sessionWithFallback.actions,
          },
          account: account.address,
          smartSession: GLOBAL_CONSTANTS.SMART_SESSIONS_ADDRESS,
          nonce: NONCE,
        },
      },
    ])
    expect(details.permissionEnableHash).not.toEqual(wrongExpected)
  })
})

describe('deriveSignedSessionPermissionFlags', () => {
  it('returns both flags false for a session with no fallback actions', () => {
    const { permitGenericPolicy, permitAdminAccess } =
      deriveSignedSessionPermissionFlags([
        {
          actionTarget: '0x000000000000000000000000000000000000cafE',
          actionTargetSelector: '0x12345678' as Hex,
          actionPolicies: [],
        },
      ])
    expect(permitGenericPolicy).toBe(false)
    expect(permitAdminAccess).toBe(false)
  })

  it('sets permitGenericPolicy when an action targets the fallback flag with the generic-policy selector', () => {
    const { permitGenericPolicy, permitAdminAccess } =
      deriveSignedSessionPermissionFlags([
        {
          actionTarget: GLOBAL_CONSTANTS.SMART_SESSIONS_FALLBACK_TARGET_FLAG,
          actionTargetSelector:
            GLOBAL_CONSTANTS.SMART_SESSIONS_FALLBACK_TARGET_SELECTOR_FLAG,
          actionPolicies: [],
        },
      ])
    expect(permitGenericPolicy).toBe(true)
    expect(permitAdminAccess).toBe(false)
  })

  it('sets permitAdminAccess when an action targets the fallback flag with the admin-access selector', () => {
    const { permitGenericPolicy, permitAdminAccess } =
      deriveSignedSessionPermissionFlags([
        {
          actionTarget: GLOBAL_CONSTANTS.SMART_SESSIONS_FALLBACK_TARGET_FLAG,
          actionTargetSelector:
            GLOBAL_CONSTANTS.SMART_SESSIONS_FALLBACK_TARGET_SELECTOR_FLAG_PERMITTED_TO_CALL_SMARTSESSION,
          actionPolicies: [],
        },
      ])
    expect(permitGenericPolicy).toBe(false)
    expect(permitAdminAccess).toBe(true)
  })

  it('ignores a fallback-target action with an unrelated selector', () => {
    const { permitGenericPolicy, permitAdminAccess } =
      deriveSignedSessionPermissionFlags([
        {
          actionTarget: GLOBAL_CONSTANTS.SMART_SESSIONS_FALLBACK_TARGET_FLAG,
          actionTargetSelector: '0xdeadbeef' as Hex,
          actionPolicies: [],
        },
      ])
    expect(permitGenericPolicy).toBe(false)
    expect(permitAdminAccess).toBe(false)
  })
})
