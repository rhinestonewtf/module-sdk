import { Account, isModuleInstalled } from 'src/account'
import { getModule, SCHEDULED_TRANSFERS_EXECUTER_ADDRESS } from 'src/module'
import { PublicClient, TestClient } from 'viem'

type Params = {
  account: Account
  publicClient: PublicClient
  testClient: TestClient
}

export const testScheduledTransfersExecutor = async ({
  account,
  publicClient,
}: Params) => {
  it('should return true when checking scheduled transfers isInstalled', async () => {
    const isScheduledTransfersInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'executor',
        module: SCHEDULED_TRANSFERS_EXECUTER_ADDRESS,
      }),
    })

    expect(isScheduledTransfersInstalled).toBe(true)
  }, 20000)
}
