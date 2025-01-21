import { Account, isModuleInstalled } from 'src/account'
import {
  getCreateScheduledTransferAction,
  getModule,
  getToggleScheduledTransferAction,
} from 'src/module'
import { ERC20Token } from 'src/module/scheduled-orders/types'
import { PublicClient, TestClient } from 'viem'
import { sendUserOp } from '../infra'
import { GLOBAL_CONSTANTS } from 'src/constants'

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
        module: GLOBAL_CONSTANTS.SCHEDULED_TRANSFERS_EXECUTOR_ADDRESS,
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
      scheduledTransfer: {
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

    expect(receipt).toBeDefined()
  }, 20000)

  it('should create a new scheduled transfer and disable it', async () => {
    // setup
    const token: ERC20Token = {
      token_address: '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3',
      decimals: 18,
    }

    const scheduledOrderAction = getCreateScheduledTransferAction({
      scheduledTransfer: {
        token,
        amount: 100,
        recipient: '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3',
        startDate: new Date().getTime(),
        repeatEvery: 10,
        numberOfRepeats: 1,
      },
    })

    let receipt = await sendUserOp({
      account,
      actions: [scheduledOrderAction],
    })

    expect(receipt).toBeDefined()

    const toggleTransferAction = getToggleScheduledTransferAction({ jobId: 1 })

    receipt = await sendUserOp({
      account,
      actions: [toggleTransferAction],
    })

    expect(receipt).toBeDefined()
  }, 20000)
}
