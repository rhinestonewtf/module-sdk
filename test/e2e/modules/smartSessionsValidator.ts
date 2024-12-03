import { Account, isModuleInstalled, encode1271Hash } from 'src/account'
import {
  getModule,
  getOwnableValidatorMockSignature,
  OWNABLE_VALIDATOR_ADDRESS,
  SMART_SESSIONS_ADDRESS,
} from 'src/module'
import {
  encodeSmartSessionSignature,
  getDisableActionPoliciesAction,
  getDisableERC1271PoliciesAction,
  getDisableUserOpPoliciesAction,
  getEnableActionPoliciesAction,
  getEnableERC1271PoliciesAction,
  getEnableSessionsAction,
  getEnableUserOpPoliciesAction,
  getPermissionId,
  getEnableSessionDetails,
  getSessionDigest,
  getSessionNonce,
  hashChainSessions,
  isSessionEnabled,
  getSpendingLimitsPolicy,
  getUniversalActionPolicy,
  UNIVERSAL_ACTION_POLICY_ADDRESS,
  ParamCondition,
  SUDO_POLICY_ADDRESS,
  getTimeFramePolicy,
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
  fromHex,
  slice,
  concat,
  zeroAddress,
  http,
  createPublicClient,
} from 'viem'
import { hashTypedData } from 'viem/experimental/solady'
import { getInstallModuleData, sendUserOp } from '../infra'
import {
  ChainSession,
  Session,
  SmartSessionMode,
} from 'src/module/smart-sessions/types'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'
import { RPC_URL } from 'test/utils/userOps/constants/contracts'

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
  }, 30000)

  it('should return permissionId for a given session', async () => {
    const { smartSessions } = getInstallModuleData({ account })
    const permissionId = getPermissionId({
      session: smartSessions.sessions[0],
    })

    expect(permissionId).toBeDefined()
  }, 30000)

  it('should check if a specific session is enabled', async () => {
    const { smartSessions } = getInstallModuleData({ account })
    const permissionId = getPermissionId({
      session: smartSessions.sessions[0],
    })
    const isEnabled = await isSessionEnabled({
      client: publicClient,
      account,
      permissionId,
    })
    expect(isEnabled).toBe(true)
  }, 30000)

  it('should validate userOp using smart session using USE flow', async () => {
    const { smartSessions } = getInstallModuleData({ account })
    const permissionId = getPermissionId({
      session: smartSessions.sessions[0],
    })

    const receipt = await sendUserOp({
      account,
      actions: [
        {
          target: smartSessions.sessions[0].actions[0].actionTarget,
          value: BigInt(0),
          callData: smartSessions.sessions[0].actions[0].actionTargetSelector,
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
          signature: getOwnableValidatorMockSignature({
            threshold: 1,
          }),
        })
      },
    })

    expect(receipt).toBeDefined()
  }, 30000)

  it('should validate userOp using smart session using ENABLE flow', async () => {
    const signer = privateKeyToAccount(process.env.PRIVATE_KEY as Hex)

    const { smartSessions } = getInstallModuleData({ account })

    const session: Session = {
      ...smartSessions.sessions[0],
      salt: toHex(toBytes('3344433', { size: 32 })),
    }

    const sepoliaPublicClient = createPublicClient({
      transport: http(RPC_URL),
      chain: sepolia,
    })

    const sessionDetails = await getEnableSessionDetails({
      sessions: [session],
      account,
      clients: [sepoliaPublicClient],
    })

    console.log(sessionDetails)

    sessionDetails.enableSessionData.enableSession.permissionEnableSig =
      await signer.signMessage({
        message: { raw: sessionDetails.permissionEnableHash },
      })

    const receipt = await sendUserOp({
      account,
      actions: [
        {
          target: session.actions[0].actionTarget,
          value: BigInt(0),
          callData: session.actions[0].actionTargetSelector,
        },
      ],
      validator: SMART_SESSIONS_ADDRESS,
      signUserOpHash: async (userOpHash) => {
        sessionDetails.signature = await signer.signMessage({
          message: { raw: userOpHash },
        })
        return encodeSmartSessionSignature(sessionDetails)
      },
      getDummySignature: async () => {
        sessionDetails.signature = getOwnableValidatorMockSignature({
          threshold: 1,
        })
        return encodeSmartSessionSignature(sessionDetails)
      },
    })

    expect(receipt).toBeDefined()
    expect(receipt.status).toBe('success')
  }, 30000)

  it('should validate userOp using smart session using ENABLE flow for safe', async () => {
    if (account.type !== 'safe') {
      return
    }
    const signer = privateKeyToAccount(process.env.PRIVATE_KEY as Hex)

    const { smartSessions } = getInstallModuleData({ account })

    const session: Session = {
      ...smartSessions.sessions[0],
      salt: toHex(toBytes('44433', { size: 32 })),
    }

    const permissionId = getPermissionId({
      session,
    })

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
          signedPermissions: {
            permitGenericPolicy: false,
            permitAdminAccess: false,
            ignoreSecurityAttestations: false,
            permitERC4337Paymaster: session.permitERC4337Paymaster,
            userOpPolicies: session.userOpPolicies,
            erc7739Policies: session.erc7739Policies,
            actions: session.actions,
          },
          account: account.address,
          smartSession: SMART_SESSIONS_ADDRESS,
          nonce: sessionNonce,
        },
      },
    ]

    const permissionEnableHash = hashChainSessions(chainSessions)

    const formattedHash = encode1271Hash({
      account,
      chainId: sepolia.id,
      validator: account.address,
      hash: permissionEnableHash,
    })

    const permissionEnableSig = await signer.signMessage({
      message: { raw: formattedHash },
    })

    let formattedSignature: Hex
    const v = fromHex(slice(permissionEnableSig, 64, 65), 'number')
    if (v < 30) {
      formattedSignature = concat([
        slice(permissionEnableSig, 0, 64),
        toHex(v + 4),
      ])
    }

    const receipt = await sendUserOp({
      account,
      actions: [
        {
          target: smartSessions.sessions[0].actions[0].actionTarget,
          value: BigInt(0),
          callData: smartSessions.sessions[0].actions[0].actionTargetSelector,
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
              permissionEnableSig: formattedSignature,
            },
            validator: account.address,
            accountType: account.type,
          },
        })
      },
      getDummySignature: async () => {
        return encodeSmartSessionSignature({
          mode: SmartSessionMode.ENABLE,
          permissionId,
          signature: getOwnableValidatorMockSignature({
            threshold: 1,
          }),
          enableSessionData: {
            enableSession: {
              chainDigestIndex: 0,
              hashesAndChainIds: chainDigests,
              sessionToEnable: session,
              permissionEnableSig: formattedSignature,
            },
            validator: account.address,
            accountType: account.type,
          },
        })
      },
    })

    expect(receipt).toBeDefined()
    expect(receipt.status).toBe('success')
  }, 30000)

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
    expect(receipt.status).toBe('success')
  }, 30000)

  it('should enable userOp policy', async () => {
    const { smartSessions } = getInstallModuleData({ account })

    const permissionId = getPermissionId({
      session: smartSessions.sessions[0],
    })

    const timeFramePolicy = getTimeFramePolicy({
      validUntil: 2733119702,
      validAfter: 1733119692,
    })

    const enableUserOpPolicyAction = getEnableUserOpPoliciesAction({
      permissionId,
      userOpPolicies: [
        {
          policy: timeFramePolicy.address,
          initData: timeFramePolicy.initData,
        },
      ],
    })

    const receipt = await sendUserOp({
      actions: [enableUserOpPolicyAction],
      account,
    })

    expect(receipt).toBeDefined()
    expect(receipt.status).toBe('success')
  }, 3000000)

  it('should disable userOp policy', async () => {
    const { smartSessions } = getInstallModuleData({ account })

    const permissionId = getPermissionId({
      session: smartSessions.sessions[0],
    })

    const disableUserOpPolicyAction = getDisableUserOpPoliciesAction({
      permissionId,
      userOpPolicies: [UNIVERSAL_ACTION_POLICY_ADDRESS],
    })

    const receipt = await sendUserOp({
      actions: [disableUserOpPolicyAction],
      account,
    })

    expect(receipt).toBeDefined()
    expect(receipt.status).toBe('success')
  }, 3000000)

  it('should enable action policy', async () => {
    const { smartSessions } = getInstallModuleData({ account })

    const permissionId = getPermissionId({
      session: smartSessions.sessions[0],
    })

    const spendingLimitsPolicy = getSpendingLimitsPolicy([
      {
        token: '0x2c4fa163b4c1A4F065D5135684E69820E101d1B7' as Address,
        limit: BigInt(1000),
      },
    ])

    const enableActionPolicyAction = getEnableActionPoliciesAction({
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
    expect(receipt.status).toBe('success')
  }, 30000)

  it('should disable action policy', async () => {
    const { smartSessions } = getInstallModuleData({ account })

    const permissionId = getPermissionId({
      session: smartSessions.sessions[0],
    })
    const actionId = keccak256(
      encodePacked(['address', 'bytes4'], [account.address, '0x150b7a02']),
    )

    const spendingLimitsPolicy = getSpendingLimitsPolicy([
      {
        token: '0x2c4fa163b4c1A4F065D5135684E69820E101d1B7' as Address,
        limit: BigInt(1000),
      },
    ])

    const disableActionPolicyAction = getDisableActionPoliciesAction({
      permissionId,
      actionId,
      policies: [spendingLimitsPolicy.address],
    })

    const receipt = await sendUserOp({
      actions: [disableActionPolicyAction],
      account,
    })

    expect(receipt).toBeDefined()
    expect(receipt.status).toBe('success')
  }, 30000)

  it('should enable ERC1271 policy', async () => {
    const { smartSessions } = getInstallModuleData({ account })

    const permissionId = getPermissionId({
      session: smartSessions.sessions[0],
    })
    const enableERC1271PolicyAction = getEnableERC1271PoliciesAction({
      permissionId,
      erc1271Policies: {
        allowedERC7739Content: [
          {
            appDomainSeparator:
              '0x681afa780d17da29203322b473d3f210a7d621259a4e6ce9e403f5a266ff719a',
            contentName: ['0x'],
          },
        ],
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
    expect(receipt.status).toBe('success')
  }, 3000000)

  it('should disable ERC1271 policy', async () => {
    const { smartSessions } = getInstallModuleData({ account })

    const permissionId = getPermissionId({
      session: smartSessions.sessions[0],
    })
    const disableERC1271PolicyAction = getDisableERC1271PoliciesAction({
      permissionId,
      policies: [SUDO_POLICY_ADDRESS],
      contents: [
        {
          appDomainSeparator:
            '0x681afa780d17da29203322b473d3f210a7d621259a4e6ce9e403f5a266ff719a',
          contentName: ['0x'],
        },
      ],
    })

    const receipt = await sendUserOp({
      actions: [disableERC1271PolicyAction],
      account,
    })

    expect(receipt).toBeDefined()
    expect(receipt.status).toBe('success')
  }, 3000000)

  it.skip('should return true when checking is valid signature', async () => {
    const signer = privateKeyToAccount(process.env.PRIVATE_KEY as Hex)

    const { smartSessions } = getInstallModuleData({ account })

    const permissionId = getPermissionId({
      session: smartSessions.sessions[0],
    })
    const userOpHash = keccak256('0xuserOpHash')

    const typedData = {
      domain: {
        name: 'SmartSession',
        version: '1',
        chainId: sepolia.id,
        verifyingContract: SMART_SESSIONS_ADDRESS,
      },
      types: {
        Permit: [{ name: 'hash', type: 'bytes' }],
      },
      primaryType: 'Permit',
      message: {
        hash: userOpHash,
      },
      extensions: [],
      fields: '0x0f',
      verifierDomain: {
        name: 'SmartSession',
        version: '1',
        verifyingContract: SMART_SESSIONS_ADDRESS,
        chainId: sepolia.id,
      },
    } as const

    const hashedData = hashTypedData(typedData)

    let signature = await signer.signMessage({ message: { raw: hashedData } })

    signature = encodePacked(['bytes32', 'bytes'], [permissionId, signature])

    const valid = (await publicClient.verifyMessage({
      address: account.address,
      message: { raw: userOpHash },
      signature: encodePacked(
        ['address', 'bytes'],
        [SMART_SESSIONS_ADDRESS, signature],
      ),
    })) as boolean

    expect(valid).toBe(true)
  }, 30000)
}
