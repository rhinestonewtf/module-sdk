import { getScheduledOrdersExecutor } from 'src'
import { getCreateScheduledOrderAction } from 'src'
import { getExecuteScheduledOrderAction } from 'src'
import { getSwapOrderData } from 'src'
import { ERC20Token } from 'src'
import { sepolia } from 'viem/chains'
import { GLOBAL_CONSTANTS } from 'src'
import { decodeAbiParameters, getAddress } from 'viem'

describe('ScheduledOrders Module', () => {
  // Setup — deliberately distinct addresses AND decimals so that swapping
  // buy/sell would be byte-visible in the encoded output. The original
  // fixture used the same address for both tokens, which made the
  // tokenIn/tokenOut inversion bug invisible to this suite.
  const sellToken: ERC20Token = {
    token_address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC, 6 decimals
    decimals: 6,
  }

  const buyToken: ERC20Token = {
    token_address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH, 18 decimals
    decimals: 18,
  }

  // Aliases kept for the pre-existing test below, which only checks
  // structural shape (target/value/callData defined) and doesn't care
  // about token identity or slot order.
  const token1: ERC20Token = sellToken
  const token2: ERC20Token = buyToken

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

  it('should encode tokenIn as the SELL token and tokenOut as the BUY token', async () => {
    // Regression test for the tokenIn/tokenOut inversion: the on-chain
    // ScheduledOrders executor (0x40dc90D670C89F322fa8b9f685770296428DCb6b,
    // verified on Arbitrum) decodes executionData as
    // (address tokenIn, address tokenOut, uint256 amountIn) and approves +
    // spends tokenIn via Uniswap — so tokenIn MUST be the token the user is
    // selling, not the one they're buying.
    const amount = 1000

    const encoded = getSwapOrderData({
      recurringOrder: {
        sellToken,
        buyToken,
        amount,
        orderType: 'sell',
        startDate: 0,
        repeatEvery: 10,
        numberOfRepeats: 1,
      },
    })

    const [tokenIn, tokenOut, amountIn] = decodeAbiParameters(
      [
        { name: 'tokenIn', type: 'address' },
        { name: 'tokenOut', type: 'address' },
        { name: 'amountIn', type: 'uint256' },
      ],
      encoded,
    )

    expect(getAddress(tokenIn)).toEqual(getAddress(sellToken.token_address))
    expect(getAddress(tokenOut)).toEqual(getAddress(buyToken.token_address))
    expect(amountIn).toEqual(BigInt(amount * 10 ** sellToken.decimals))
  })
})
