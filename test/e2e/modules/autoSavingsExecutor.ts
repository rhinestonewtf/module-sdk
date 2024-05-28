import { Account, isModuleInstalled } from 'src/account'
import { getModule } from 'src/module'
import { AUTO_SAVINGS_ADDRESS } from 'src/module/auto-savings'
import { PublicClient, TestClient } from 'viem'

type Params = {
  account: Account
  publicClient: PublicClient
  testClient: TestClient
}

export const testAutoSavingsExecutor = async ({
  account,
  publicClient,
}: Params) => {
  it('should return true when checking auto saving executor isInstalled', async () => {
    const isAutoSavingExecutorInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'executor',
        module: AUTO_SAVINGS_ADDRESS,
      }),
    })

    expect(isAutoSavingExecutorInstalled).toBe(true)
  }, 20000)
}
