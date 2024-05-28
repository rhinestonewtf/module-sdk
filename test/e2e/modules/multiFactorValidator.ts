import { Account, isModuleInstalled } from 'src/account'
import { getModule } from 'src/module'
import { MULTI_FACTOR_VALIDATOR_ADDRESS } from 'src/module/multi-factor-validator'
import { PublicClient, TestClient } from 'viem'

type Params = {
  account: Account
  publicClient: PublicClient
  testClient: TestClient
}

export const testMultiFactorValidator = async ({
  account,
  publicClient,
}: Params) => {
  it('should return true when checking multi factor validator isInstalled', async () => {
    const isMFAInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'validator',
        module: MULTI_FACTOR_VALIDATOR_ADDRESS,
      }),
    })

    expect(isMFAInstalled).toBe(true)
  }, 20000)
}
