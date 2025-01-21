import {
  getScheduledTransfersExecutor,
  getToggleScheduledTransferAction,
} from 'src/module'
import {
  getCreateScheduledTransferAction,
  getExecuteScheduledTransferAction,
} from 'src/module'
import { ERC20Token } from 'src'
import { GLOBAL_CONSTANTS } from 'src'

describe('ScheduledTransfers Module', () => {
  // Setup
  const token: ERC20Token = {
    token_address: '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3',
    decimals: 18,
  }

  it('should get install scheduled transfers module', async () => {
    const installScheduledTransfersModule = getScheduledTransfersExecutor({
      numberOfExecutions: 1,
      executeInterval: 10,
      startDate: new Date().getTime(),
      executionData: '0x',
    })

    expect(installScheduledTransfersModule.module).toEqual(
      GLOBAL_CONSTANTS.SCHEDULED_TRANSFERS_EXECUTOR_ADDRESS,
    )
    expect(installScheduledTransfersModule.initData).toBeDefined()
    expect(installScheduledTransfersModule.type).toEqual('executor')
  })

  it('Should get createScheduledTransferExecution action', async () => {
    const createScheduledTransferExecution = getCreateScheduledTransferAction({
      scheduledTransfer: {
        token,
        amount: 100,
        recipient: '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3',
        startDate: new Date().getTime(),
        repeatEvery: 10,
        numberOfRepeats: 1,
      },
    })

    expect(createScheduledTransferExecution.target).toEqual(
      GLOBAL_CONSTANTS.SCHEDULED_TRANSFERS_EXECUTOR_ADDRESS,
    )
    expect(createScheduledTransferExecution.value).toEqual(BigInt(0))
    expect(createScheduledTransferExecution.callData).toBeDefined()
  })

  it('should disable scheduled transfer', async () => {
    const toggleTransfer = getToggleScheduledTransferAction({ jobId: 1 })

    expect(toggleTransfer.target).toEqual(
      GLOBAL_CONSTANTS.SCHEDULED_TRANSFERS_EXECUTOR_ADDRESS,
    )
    expect(toggleTransfer.value).toEqual(BigInt(0))
    expect(toggleTransfer.callData).toBeDefined()
  })

  it('should get execute transfer action', async () => {
    const executeTransfer = getExecuteScheduledTransferAction({ jobId: 1 })

    expect(executeTransfer.target).toEqual(
      GLOBAL_CONSTANTS.SCHEDULED_TRANSFERS_EXECUTOR_ADDRESS,
    )
    expect(executeTransfer.value).toEqual(BigInt(0))
    expect(executeTransfer.callData).toBeDefined()
  })
})
