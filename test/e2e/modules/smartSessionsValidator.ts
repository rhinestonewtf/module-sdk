import { Account, isModuleInstalled } from 'src/account'
import {
  getModule,
  getOwnableValidatorMockSignature,
  SMART_SESSIONS_ADDRESS,
} from 'src/module'
import {
  encodeSmartSessionSignature,
  getPermissionId,
  isSessionEnabled,
} from 'src/module/smart-sessions'
import { Hex, PublicClient, TestClient } from 'viem'
import { getInstallModuleData, sendUserOp } from '../infra'
import { SmartSessionMode } from 'src/module/smart-sessions/types'
import { privateKeyToAccount } from 'viem/accounts'

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

    const sessionEnabled = await isSessionEnabled({
      permissionId,
      account,
      client: publicClient,
    })

    console.log('sessionEnabled', sessionEnabled)

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
  })
}
