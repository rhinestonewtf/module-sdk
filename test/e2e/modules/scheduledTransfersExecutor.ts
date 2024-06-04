import { Account, isModuleInstalled } from 'src/account'
import {
  getCreateScheduledTransferAction,
  getModule,
  SCHEDULED_TRANSFERS_EXECUTER_ADDRESS,
} from 'src/module'
import { ERC20Token } from 'src/module/scheduled-orders/types'
import { PublicClient, TestClient } from 'viem'
import { sendUserOp } from '../infra'

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

  it('should create a new scheduled transfer', async () => {
    // setup
    const token: ERC20Token = {
      token_address: '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3',
      decimals: 18,
    }

    const scheduledOrderAction = getCreateScheduledTransferAction({
      scheduledTransaction: {
        token,
        amount: 100,
        recipient: '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3',
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
