import { Account, isModuleInstalled } from 'src/account'
import {
  getModule,
  getOwnableValidatorMockSignature,
  OWNABLE_VALIDATOR_ADDRESS,
  SMART_SESSIONS_ADDRESS,
} from 'src/module'
import {
  encodeSmartSessionSignature,
  getPermissionId,
  getSessionDigest,
  getSessionNonce,
  hashChainSessions,
} from 'src/module/smart-sessions'
import { Hex, PublicClient, TestClient, toBytes, toHex } from 'viem'
import { getInstallModuleData, sendUserOp } from '../infra'
import {
  ChainSession,
  Session,
  SmartSessionMode,
} from 'src/module/smart-sessions/types'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

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

  it('should validate userOp using smart session using ENABLE flow', async () => {
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
}
