import { getScheduledOrdersExecutor } from 'src'
import { getCreateScheduledOrderAction } from 'src'
import { getExecuteScheduledOrderAction } from 'src'
import { ERC20Token } from 'src'
import { sepolia } from 'viem/chains'
import { GLOBAL_CONSTANTS } from 'src'

describe('ScheduledOrders Module', () => {
  // Setup
  const token1: ERC20Token = {
    token_address: '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3',
    decimals: 18,
  }

  const token2: ERC20Token = {
    token_address: '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3',
    decimals: 18,
  }

  it('should get install scheduled orders module', async () => {
    const installScheduledOrdersModule = getScheduledOrdersExecutor({
      chainId: sepolia.id,
      numberOfExecutions: 1,
      executeInterval: 10,
      startDate: new Date().getTime(),
      executionData: '0x',
    })

    expect(installScheduledOrdersModule.module).toEqual(
      GLOBAL_CONSTANTS.SCHEDULED_ORDERS_EXECUTOR_ADDRESS,
    )
    expect(installScheduledOrdersModule.initData).toBeDefined()
    expect(installScheduledOrdersModule.type).toEqual('executor')
  })

  it('Should get createScheduledOrderExecution action', async () => {
    const createScheduledOrderExecution = getCreateScheduledOrderAction({
      recurringOrder: {
        buyToken: token1,
        sellToken: token2,
        amount: 100,
        orderType: 'sell',
        priceLimit: '0',
        maxGasPrice: '0',
        expirationDate: new Date().getTime().toString(),
        startDate: new Date().getTime(),
        repeatEvery: 10,
        numberOfRepeats: 1,
      },
    })

    expect(createScheduledOrderExecution.target).toEqual(
      GLOBAL_CONSTANTS.SCHEDULED_ORDERS_EXECUTOR_ADDRESS,
    )
    expect(createScheduledOrderExecution.value).toEqual(BigInt(0))
    expect(createScheduledOrderExecution.callData).toBeDefined()
  })

  it('should get execute order action', async () => {
    const executeOrder = getExecuteScheduledOrderAction({ jobId: 1 })

    expect(executeOrder.target).toEqual(
      GLOBAL_CONSTANTS.SCHEDULED_ORDERS_EXECUTOR_ADDRESS,
    )
    expect(executeOrder.value).toEqual(BigInt(0))
    expect(executeOrder.callData).toBeDefined()
  })
})
