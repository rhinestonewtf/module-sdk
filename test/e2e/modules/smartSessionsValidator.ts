import { Account, isModuleInstalled } from 'src/account'
import {
  getModule,
  getOwnableValidatorMockSignature,
  OWNABLE_VALIDATOR_ADDRESS,
  SMART_SESSIONS_ADDRESS,
} from 'src/module'
import {
  encodeSmartSessionSignature,
  getDisableActionPolicies,
  getDisableERC1271PoliciesAction,
  getDisableUserOpPoliciesAction,
  getEnableActionPolicies,
  getEnableERC1271PoliciesAction,
  getEnableSessionsAction,
  getEnableUserOpPoliciesAction,
  getPermissionId,
  getSessionDigest,
  getSessionNonce,
  hashChainSessions,
} from 'src/module/smart-sessions'
import {
  Address,
  encodePacked,
  Hex,
  keccak256,
  PublicClient,
  TestClient,
  toBytes,
  toHex,
} from 'viem'
import { getInstallModuleData, sendUserOp } from '../infra'
import {
  ChainSession,
  Session,
  SmartSessionMode,
} from 'src/module/smart-sessions/types'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'
import { getSpendingLimitsPolicy } from 'src/module/smart-sessions/policies/spending-limits-policy'
import {
  getUniversalActionPolicy,
  UNIVERSAL_ACTION_POLICY_ADDRESS,
} from 'src/module/smart-sessions/policies/universal-action-policy'
import { ParamCondition } from 'src/module/smart-sessions/policies/universal-action-policy/types'
import { SUDO_POLICY_ADDRESS } from 'src/module/smart-sessions/policies/sudo-policy'

type Params = {
  account: Account
  publicClient: PublicClient
  testClient: TestClient
}

export const testSmartSessionsValidator = async ({
  account,
  publicClient,
}: Params) => {
  it('should return true when checking smart session validator isInstalled', async () => {
    const isSmartSessionsInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'validator',
        module: SMART_SESSIONS_ADDRESS,
      }),
    })

    expect(isSmartSessionsInstalled).toBe(true)
  }, 20000)

  it('should return permissionId for a given session', async () => {
    const { smartSessions } = getInstallModuleData({ account })
    const permissionId = (await getPermissionId({
      client: publicClient,
      session: smartSessions.sessions[0],
    })) as Hex

    expect(permissionId).toBeDefined()
  }, 20000)

  it('should validate userOp using smart session using USE flow', async () => {
    const { smartSessions } = getInstallModuleData({ account })
    const permissionId = (await getPermissionId({
      client: publicClient,
      session: smartSessions.sessions[0],
    })) as Hex

    const receipt = await sendUserOp({
      account,
      actions: [
        {
          target: account.address,
          value: BigInt(0),
          callData: '0x9cfd7cff',
        },
      ],
      validator: SMART_SESSIONS_ADDRESS,
      signUserOpHash: async (userOpHash) => {
        const signer = privateKeyToAccount(process.env.PRIVATE_KEY as Hex)

        const signature = await signer.signMessage({
          message: { raw: userOpHash },
        })

        return encodeSmartSessionSignature({
          mode: SmartSessionMode.USE,
          permissionId,
          signature,
        })
      },
      getDummySignature: async () => {
        return encodeSmartSessionSignature({
          mode: SmartSessionMode.USE,
          permissionId,
          signature: getOwnableValidatorMockSignature(),
        })
      },
    })

    expect(receipt).toBeDefined()
  }, 20000)

  it('should validate userOp using smart session using ENABLE flow', async () => {
    const signer = privateKeyToAccount(process.env.PRIVATE_KEY as Hex)

    const { smartSessions } = getInstallModuleData({ account })

    const session: Session = {
      ...smartSessions.sessions[0],
      salt: toHex(toBytes('2', { size: 32 })),
    }

    const permissionId = (await getPermissionId({
      client: publicClient,
      session,
    })) as Hex

    const sessionNonce = await getSessionNonce({
      client: publicClient,
      account,
      permissionId,
    })

    const sessionDigest = await getSessionDigest({
      client: publicClient,
      account,
      session,
      mode: SmartSessionMode.ENABLE,
      permissionId,
    })

    const chainDigests = [
      {
        chainId: BigInt(sepolia.id),
        sessionDigest,
      },
    ]

    const chainSessions: ChainSession[] = [
      {
        chainId: BigInt(sepolia.id),
        session: {
          ...session,
          account: account.address,
          smartSession: SMART_SESSIONS_ADDRESS,
          mode: 1,
          nonce: sessionNonce,
        },
      },
    ]

    const permissionEnableHash = hashChainSessions(chainSessions)

    const permissionEnableSig = await signer.signMessage({
      message: { raw: permissionEnableHash },
    })

    const receipt = await sendUserOp({
      account,
      actions: [
        {
          target: account.address,
          value: BigInt(0),
          callData: '0x9cfd7cff',
        },
      ],
      validator: SMART_SESSIONS_ADDRESS,
      signUserOpHash: async (userOpHash) => {
        const signature = await signer.signMessage({
          message: { raw: userOpHash },
        })

        return encodeSmartSessionSignature({
          mode: SmartSessionMode.ENABLE,
          permissionId,
          signature,
          enableSessionData: {
            enableSession: {
              chainDigestIndex: 0,
              hashesAndChainIds: chainDigests,
              sessionToEnable: session,
              permissionEnableSig,
            },
            validator: OWNABLE_VALIDATOR_ADDRESS,
            accountType: 'erc7579-implementation',
          },
        })
      },
      getDummySignature: async () => {
        return encodeSmartSessionSignature({
          mode: SmartSessionMode.ENABLE,
          permissionId,
          signature: getOwnableValidatorMockSignature(),
          enableSessionData: {
            enableSession: {
              chainDigestIndex: 0,
              hashesAndChainIds: chainDigests,
              sessionToEnable: session,
              permissionEnableSig,
            },
            validator: OWNABLE_VALIDATOR_ADDRESS,
            accountType: 'erc7579-implementation',
          },
        })
      },
    })

    expect(receipt).toBeDefined()
  }, 20000)

  it('should add new session for the account', async () => {
    const { smartSessions } = getInstallModuleData({ account })

    const session: Session = {
      ...smartSessions.sessions[0],
      salt: toHex(toBytes(55, { size: 32 })),
    }

    const enableSessionAction = getEnableSessionsAction({
      sessions: [session],
    })

    const receipt = await sendUserOp({
      actions: [enableSessionAction],
      account,
    })

    expect(receipt).toBeDefined()
  }, 20000)

  it('should enable userOp policy', async () => {
    const { smartSessions } = getInstallModuleData({ account })

    const permissionId = (await getPermissionId({
      client: publicClient,
      session: smartSessions.sessions[0],
    })) as Hex

    const uniActionPolicy = getUniversalActionPolicy({
      paramRules: {
        length: 0,
        rules: new Array(16).fill({
          condition: ParamCondition.EQUAL,
          isLimited: false,
          offset: 0,
          ref: toHex(toBytes('0x', { size: 32 })),
          usage: { limit: BigInt(0), used: BigInt(0) },
        }),
      },
      valueLimitPerUse: BigInt(100),
    })

    const enableUserOpPolicyAction = getEnableUserOpPoliciesAction({
      permissionId,
      userOpPolicies: [
        {
          policy: uniActionPolicy.address,
          initData: uniActionPolicy.initData,
        },
      ],
    })

    const receipt = await sendUserOp({
      actions: [enableUserOpPolicyAction],
      account,
    })

    expect(receipt).toBeDefined()
  }, 2000000)

  it('should disable userOp policy', async () => {
    const { smartSessions } = getInstallModuleData({ account })

    const permissionId = (await getPermissionId({
      client: publicClient,
      session: smartSessions.sessions[0],
    })) as Hex

    const disableUserOpPolicyAction = getDisableUserOpPoliciesAction({
      permissionId,
      userOpPolicies: [UNIVERSAL_ACTION_POLICY_ADDRESS],
    })

    const receipt = await sendUserOp({
      actions: [disableUserOpPolicyAction],
      account,
    })

    expect(receipt).toBeDefined()
  }, 2000000)

  it('should enable action policy', async () => {
    const { smartSessions } = getInstallModuleData({ account })

    const permissionId = (await getPermissionId({
      client: publicClient,
      session: smartSessions.sessions[0],
    })) as Hex

    const spendingLimitsPolicy = getSpendingLimitsPolicy([
      {
        token: '0x2c4fa163b4c1A4F065D5135684E69820E101d1B7' as Address,
        limit: BigInt(1000),
      },
    ])

    const enableActionPolicyAction = getEnableActionPolicies({
      permissionId,
      actionPolicies: [
        {
          actionTarget: spendingLimitsPolicy.address,
          actionTargetSelector: '0x150b7a02',
          actionPolicies: [
            {
              policy: spendingLimitsPolicy.address,
              initData: spendingLimitsPolicy.initData,
            },
          ],
        },
      ],
    })

    const receipt = await sendUserOp({
      actions: [enableActionPolicyAction],
      account,
    })

    expect(receipt).toBeDefined()
  }, 20000)

  it('should disable action policy', async () => {
    const { smartSessions } = getInstallModuleData({ account })

    const permissionId = (await getPermissionId({
      client: publicClient,
      session: smartSessions.sessions[0],
    })) as Hex

    const actionId = keccak256(
      encodePacked(['address', 'bytes4'], [account.address, '0x150b7a02']),
    )

    const spendingLimitsPolicy = getSpendingLimitsPolicy([
      {
        token: '0x2c4fa163b4c1A4F065D5135684E69820E101d1B7' as Address,
        limit: BigInt(1000),
      },
    ])

    const disableActionPolicyAction = getDisableActionPolicies({
      permissionId,
      actionId,
      policies: [spendingLimitsPolicy.address],
    })

    const receipt = await sendUserOp({
      actions: [disableActionPolicyAction],
      account,
    })

    expect(receipt).toBeDefined()
  }, 20000)

  it('should enable ERC1271 policy', async () => {
    const { smartSessions } = getInstallModuleData({ account })

    const permissionId = (await getPermissionId({
      client: publicClient,
      session: smartSessions.sessions[0],
    })) as Hex

    const enableERC1271PolicyAction = getEnableERC1271PoliciesAction({
      permissionId,
      erc1271Policies: {
        allowedERC7739Content: ['0x'],
        erc1271Policies: [
          {
            policy: SUDO_POLICY_ADDRESS,
            initData: '0x',
          },
        ],
      },
    })

    const receipt = await sendUserOp({
      actions: [enableERC1271PolicyAction],
      account,
    })

    expect(receipt).toBeDefined()
  }, 2000000)

  it('should disable ERC1271 policy', async () => {
    const { smartSessions } = getInstallModuleData({ account })

    const permissionId = (await getPermissionId({
      client: publicClient,
      session: smartSessions.sessions[0],
    })) as Hex

    const disableERC1271PolicyAction = getDisableERC1271PoliciesAction({
      permissionId,
      policies: [SUDO_POLICY_ADDRESS],
    })

    const receipt = await sendUserOp({
      actions: [disableERC1271PolicyAction],
      account,
    })

    expect(receipt).toBeDefined()
  }, 2000000)
}
