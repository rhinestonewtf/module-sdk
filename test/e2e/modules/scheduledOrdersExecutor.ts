import { Account, isModuleInstalled } from 'src/account'
import { getModule, SCHEDULED_ORDERS_EXECUTER_ADDRESS } from 'src/module'
import { PublicClient, TestClient } from 'viem'

type Params = {
  account: Account
  publicClient: PublicClient
  testClient: TestClient
}

export const testScheduledOrdersExecutor = async ({
  account,
  publicClient,
}: Params) => {
  it('should return true when checking scheduled orders isInstalled', async () => {
    const isScheduledOrdersInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'executor',
        module: SCHEDULED_ORDERS_EXECUTER_ADDRESS,
      }),
    })

    expect(isScheduledOrdersInstalled).toBe(true)
  }, 20000)
}
