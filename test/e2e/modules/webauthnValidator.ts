import { Account, isModuleInstalled } from 'src/account'
import { getModule, WEBAUTHN_VALIDATOR_ADDRESS } from 'src/module'
import { PublicClient, TestClient } from 'viem'

type Params = {
  account: Account
  publicClient: PublicClient
  testClient: TestClient
}

export const testWebauthnValidator = async ({
  account,
  publicClient,
}: Params) => {
  it('should return true when checking webAuthn validator isInstalled', async () => {
    const isWebauthnValidatorInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'validator',
        module: WEBAUTHN_VALIDATOR_ADDRESS,
      }),
    })

    expect(isWebauthnValidatorInstalled).toBe(true)
  }, 20000)
}
