import { getScheduledOrdersExecutor } from 'src/module'
import { SCHEDULED_ORDERS_EXECUTER_ADDRESS } from 'src'
import { getCreateScheduledOrderAction } from 'src'
import { ERC20Token } from 'src'

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
      numberOfExecutions: 1,
      executeInterval: 10,
      startDate: new Date().getTime(),
      executionData: '0x',
    })

    expect(installScheduledOrdersModule.module).toEqual(
      SCHEDULED_ORDERS_EXECUTER_ADDRESS,
    )
    expect(installScheduledOrdersModule.data).toBeDefined()
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
      SCHEDULED_ORDERS_EXECUTER_ADDRESS,
    )
    expect(createScheduledOrderExecution.value).toEqual(BigInt(0))
    expect(createScheduledOrderExecution.callData).toBeDefined()
  })
})
