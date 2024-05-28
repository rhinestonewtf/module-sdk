import { Account, isModuleInstalled } from 'src/account'
import { getModule } from 'src/module'
import { OWNABLE_EXECUTER_ADDRESS } from 'src/module/ownable-executer'
import { PublicClient, TestClient } from 'viem'

type Params = {
  account: Account
  publicClient: PublicClient
  testClient: TestClient
}

export const testOwnableExecutor = async ({
  account,
  publicClient,
}: Params) => {
  it('should return true when checking ownable executer isInstalled', async () => {
    const isOwnableValidatorInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'executor',
        module: OWNABLE_EXECUTER_ADDRESS,
      }),
    })

    expect(isOwnableValidatorInstalled).toBe(true)
  }, 20000)
}
