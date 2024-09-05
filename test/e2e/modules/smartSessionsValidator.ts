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
  getEnableActionPolicies,
  getEnableSessionsAction,
  getEnableUserOpPoliciesAction,
  getPermissionId,
  // getRemoveSessionAction,
  getSessionDigest,
  getSessionNonce,
  hashChainSessions,
  isSessionEnabled,
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
import { getUniversalActionPolicy } from 'src/module/smart-sessions/policies/universal-action-policy'
// import { getSudoPolicy } from 'src/module/smart-sessions/policies/sudo-policy'

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
    const permissionId = await getPermissionId({
      client: publicClient,
      session: smartSessions[0],
    })

    expect(permissionId).toBeDefined()
  }, 20000)

  it('should validate userOp using smart session using USE flow', async () => {
    const { smartSessions } = getInstallModuleData({ account })
    const permissionId = (await getPermissionId({
      client: publicClient,
      session: smartSessions[0],
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

  it.skip('should validate userOp using smart session using ENABLE flow', async () => {
    const signer = privateKeyToAccount(process.env.PRIVATE_KEY as Hex)

    const { smartSessions } = getInstallModuleData({ account })

    const session: Session = {
      ...smartSessions[0],
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
      ...smartSessions[0],
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

  it('should enable action policy', async () => {
    const { smartSessions } = getInstallModuleData({ account })

    const permissionId = (await getPermissionId({
      client: publicClient,
      session: smartSessions[0],
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
      session: smartSessions[0],
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

  it('should enable userOp policy', async () => {
    const { smartSessions } = getInstallModuleData({ account })

    const permissionId = (await getPermissionId({
      client: publicClient,
      session: smartSessions[0],
    })) as Hex

    console.log('permissionId', permissionId)

    const uniActionPolicy = getUniversalActionPolicy({
      paramRules: {
        length: 0,
        rules: [],
      },
      valueLimitPerUse: BigInt(100000000000000000),
    })

    console.log('uniActionPolicy', uniActionPolicy)

    const sessionEanbled = await isSessionEnabled({
      client: publicClient,
      account,
      permissionId,
    })

    console.log('sessionEanbled !!!', sessionEanbled)

    const enableUserOpPolicyAction = getEnableUserOpPoliciesAction({
      permissionId,
      userOpPolicies: [
        // {
        //   policy: getSudoPolicy().address,
        //   initData: getSudoPolicy().initData,
        // },
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

    console.log('receipt !!!', receipt)

    expect(receipt).toBeDefined()
  }, 20000)
}
