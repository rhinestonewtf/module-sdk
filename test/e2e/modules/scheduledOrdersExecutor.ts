import { Account, isModuleInstalled } from 'src/account'
import {
  getCreateScheduledOrderAction,
  getModule,
  SCHEDULED_ORDERS_EXECUTER_ADDRESS,
} from 'src/module'
import { ERC20Token } from 'src/module/scheduled-orders/types'
import { PublicClient, TestClient } from 'viem'
import { sendUserOp } from '../infra'

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

  it('should create a new scheduled order', async () => {
    const token1: ERC20Token = {
      token_address: '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3',
      decimals: 18,
    }

    const token2: ERC20Token = {
      token_address: '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3',
      decimals: 18,
    }
    const scheduledOrderAction = getCreateScheduledOrderAction({
      recurringOrder: {
        buyToken: token1,
        sellToken: token2,
        amount: 200,
        orderType: 'sell',
        priceLimit: '0',
        maxGasPrice: '0',
        expirationDate: new Date().getTime().toString(),
        startDate: new Date().getTime(),
        repeatEvery: 10,
        numberOfRepeats: 1,
      },
    })

    const receipt = await sendUserOp({
      account,
      actions: [scheduledOrderAction],
    })

    expect(receipt.success).toEqual(true)
  }, 20000)
}
