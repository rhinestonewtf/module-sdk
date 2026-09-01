import { getEnableSessionsAction, getPermissions } from 'src/module'
import {
  createPublicClient,
  decodeErrorResult,
  getAddress,
  http,
  PublicClient,
  toFunctionSelector,
} from 'viem'
import { sepolia } from 'viem/chains'
import { GLOBAL_CONSTANTS } from 'src/constants'
import { Session } from 'src/module/smart-sessions/types'

// Regression coverage for a bug where `getPermissions` placed the ERC-20
// spending-limit policy (an action-only IActionPolicy) into `userOpPolicies`
// instead of `actions[].actionPolicies`, causing SmartSession's
// `enableSessions`/`onInstall` to revert with `UnsupportedPolicy` for every
// ERC-7715 `erc20-token-transfer` permission.
describe('ERC-7715 getPermissions', () => {
  const DUMMY_TOKEN = getAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48')

  describe('structural: policy lands in the correct slot', () => {
    it('places native-token-transfer, usage-limit and timeframe policies in userOpPolicies (they implement IUserOpPolicy)', () => {
      const result = getPermissions({
        permissions: [
          {
            type: 'native-token-transfer',
            data: { allowance: 1000000000000000000n },
          },
          { type: 'usage-limit', data: { limit: 5n } },
          {
            type: 'timeframe',
            data: { validUntil: 9999999999n, validAfter: 0n },
          },
        ],
      })

      expect(result.userOpPolicies).toHaveLength(3)
      expect(result.actions).toHaveLength(0)
    })

    it('places the erc20-token-transfer spending-limit policy in actions[].actionPolicies, NOT userOpPolicies (ERC20SpendingLimitPolicy is IActionPolicy-only)', () => {
      const result = getPermissions({
        permissions: [
          {
            type: 'erc20-token-transfer',
            data: { address: DUMMY_TOKEN, allowance: 1000000n },
          },
        ],
      })

      // The bug: this policy used to land here, and SmartSession rejects it
      // as a userOp policy because ERC20SpendingLimitPolicy never implements
      // IUserOpPolicy.
      expect(result.userOpPolicies).toHaveLength(0)

      // The fix: it must be scoped to the token as an action policy instead.
      expect(result.actions).toHaveLength(1)
      expect(result.actions[0].actionTarget).toBe(DUMMY_TOKEN)
      expect(result.actions[0].actionTargetSelector).toBe(
        toFunctionSelector('function transfer(address,uint256)'),
      )
      expect(result.actions[0].actionPolicies).toHaveLength(1)
      expect(result.actions[0].actionPolicies[0].policy).toBe(
        GLOBAL_CONSTANTS.SPENDING_LIMITS_POLICY_ADDRESS,
      )
    })

    it('every policy that getPermissions ever places in userOpPolicies is a genuine userOp-type policy, never the ERC-20 spending-limit policy', () => {
      // Structural guard against a future case in the switch repeating this
      // mistake: none of the *known* userOp-policy addresses this function
      // can emit is the spending-limit policy address.
      const result = getPermissions({
        permissions: [
          { type: 'native-token-transfer', data: { allowance: 1n } },
          { type: 'usage-limit', data: { limit: 1n } },
          { type: 'timeframe', data: { validUntil: 1n, validAfter: 0n } },
          {
            type: 'erc20-token-transfer',
            data: { address: DUMMY_TOKEN, allowance: 1n },
          },
        ],
      })

      for (const policy of result.userOpPolicies) {
        expect(policy.policy).not.toBe(
          GLOBAL_CONSTANTS.SPENDING_LIMITS_POLICY_ADDRESS,
        )
      }
    })
  })

  describe('on-chain: SmartSession.enableSessions accepts the encoded session', () => {
    let client: PublicClient
    beforeAll(() => {
      client = createPublicClient({
        chain: sepolia,
        transport: http('https://rpc.sepolia.ethpandaops.io'),
      })
    })

    // A minimal, unregistered ISessionValidator-shaped address will still
    // fail later in `_enableSessions` (it has no code, so
    // `isModuleType(...)` reverts on ABI-decoding empty returndata) - that
    // failure is expected and shared by every permission type. What this
    // test isolates is whether the call reverts *earlier*, at the
    // policy-type gate, with the specific `UnsupportedPolicy` error - that
    // earlier revert is exactly the bug this PR fixes, and only ever fired
    // for `erc20-token-transfer` before the fix.
    const DUMMY_SESSION_VALIDATOR = getAddress(
      '0x1234567890123456789012345678901234567890',
    )

    // `client.call` does not surface a decoded custom-error name in
    // `.shortMessage`/`.message` for an unrecognized selector - it just
    // reports "Execution reverted for an unknown reason." The raw revert
    // data lives several levels down the error cause chain, so walk() it
    // out and decode it explicitly against SmartSession's own error ABI.
    const smartSessionErrorAbi = [
      {
        type: 'error',
        name: 'UnsupportedPolicy',
        inputs: [{ name: 'policy', type: 'address' }],
      },
    ] as const

    async function callEnableSessions(session: Session) {
      const action = getEnableSessionsAction({ sessions: [session] })
      try {
        await client.call({
          to: action.to,
          data: action.data,
          account: getAddress('0x000000000000000000000000000000000000dEaD'),
        })
        return { unsupportedPolicy: false as const, policy: undefined }
      } catch (error: any) {
        const rawData = error.walk?.((err: any) => err.data)?.data as
          | `0x${string}`
          | undefined
        if (!rawData || rawData === '0x') {
          return { unsupportedPolicy: false as const, policy: undefined }
        }
        try {
          const decoded = decodeErrorResult({
            abi: smartSessionErrorAbi,
            data: rawData,
          })
          return {
            unsupportedPolicy: decoded.errorName === 'UnsupportedPolicy',
            policy:
              decoded.errorName === 'UnsupportedPolicy'
                ? (decoded.args[0] as string)
                : undefined,
          }
        } catch {
          // Reverted with a different, unrelated error (e.g. the dummy
          // session validator has no code) - not the bug this test targets.
          return { unsupportedPolicy: false as const, policy: undefined }
        }
      }
    }

    // `unsupportedPolicy: false` in the tests below can mean either "the
    // call genuinely got past the policy-type gate" (what we want to prove)
    // or "the RPC call failed to reach the chain at all" (which would
    // silently make every assertion below pass without testing anything).
    // This positive control closes that gap: it deliberately re-injects the
    // exact bug this PR fixes (spending-limit policy manually placed in
    // userOpPolicies) and requires the harness to actually detect and decode
    // `UnsupportedPolicy(<the real spending-limit policy address>)`. If the
    // RPC is unreachable, this test fails loudly instead of every other test
    // silently passing for the wrong reason.
    it('[positive control] genuinely detects UnsupportedPolicy when the exact bug is reintroduced', async () => {
      const built = getPermissions({
        permissions: [
          {
            type: 'erc20-token-transfer',
            data: { address: DUMMY_TOKEN, allowance: 1000000n },
          },
        ],
      })
      const spendingLimitPolicy = built.actions[0].actionPolicies[0]

      const session: Session = {
        sessionValidator: DUMMY_SESSION_VALIDATOR,
        sessionValidatorInitData: '0x',
        salt: `0x${'3'.padStart(64, '0')}`,
        // Manually reconstruct the pre-fix bug: the action-only policy back
        // in userOpPolicies, exactly as the buggy `getPermissions` used to
        // emit it.
        userOpPolicies: [spendingLimitPolicy],
        erc7739Policies: { allowedERC7739Content: [], erc1271Policies: [] },
        actions: [],
        permitERC4337Paymaster: false,
        chainId: BigInt(sepolia.id),
      }

      const result = await callEnableSessions(session)

      expect(result.unsupportedPolicy).toBe(true)
      expect(getAddress(result.policy!)).toBe(
        getAddress(spendingLimitPolicy.policy),
      )
    }, 30000)

    it('does not revert with UnsupportedPolicy for an erc20-token-transfer permission', async () => {
      const built = getPermissions({
        permissions: [
          {
            type: 'erc20-token-transfer',
            data: { address: DUMMY_TOKEN, allowance: 1000000n },
          },
        ],
      })

      const session: Session = {
        sessionValidator: DUMMY_SESSION_VALIDATOR,
        sessionValidatorInitData: '0x',
        salt: `0x${'1'.padStart(64, '0')}`,
        userOpPolicies: built.userOpPolicies,
        erc7739Policies: built.erc7739Policies,
        actions: built.actions,
        permitERC4337Paymaster: false,
        chainId: BigInt(sepolia.id),
      }

      const result = await callEnableSessions(session)

      // Pre-fix this reverted here with `UnsupportedPolicy(...)`, distinctly
      // earlier than the shared dummy-validator failure the control below
      // also hits.
      expect(result.unsupportedPolicy).toBe(false)
    }, 30000)

    it('the other three ERC-7715 permission types also do not revert with UnsupportedPolicy (unaffected control)', async () => {
      const built = getPermissions({
        permissions: [
          {
            type: 'native-token-transfer',
            data: { allowance: 1000000000000000000n },
          },
          { type: 'usage-limit', data: { limit: 5n } },
          {
            type: 'timeframe',
            data: { validUntil: 9999999999n, validAfter: 0n },
          },
        ],
      })

      const session: Session = {
        sessionValidator: DUMMY_SESSION_VALIDATOR,
        sessionValidatorInitData: '0x',
        salt: `0x${'2'.padStart(64, '0')}`,
        userOpPolicies: built.userOpPolicies,
        erc7739Policies: built.erc7739Policies,
        actions: built.actions,
        permitERC4337Paymaster: false,
        chainId: BigInt(sepolia.id),
      }

      const result = await callEnableSessions(session)
      expect(result.unsupportedPolicy).toBe(false)
    }, 30000)
  })
})
