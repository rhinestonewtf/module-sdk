import {
  Address,
  Hex,
  encodeAbiParameters,
  encodeFunctionData,
  encodePacked,
} from 'viem'
import { SCHEDULED_ORDERS_EXECUTOR_ADDRESS } from './constants'
import { RecurringOrder } from './types'
import { Execution } from '../../account/types'
import { abi } from './abi'
import { getSwapDetails } from '../utils/uniswap'

type Params = {
  recurringOrder: RecurringOrder
}

export const getCreateScheduledOrderAction = ({
  recurringOrder,
}: Params): Execution => {
  const data = encodeFunctionData({
    functionName: 'addOrder',
    abi,
    args: [
      encodePacked(
        ['uint48', 'uint16', 'uint48', 'bytes'],
        [
          recurringOrder.repeatEvery,
          recurringOrder.numberOfRepeats,
          recurringOrder.startDate,
          getSwapOrderData({ recurringOrder }),
        ],
      ),
    ],
  })

  return {
    to: SCHEDULED_ORDERS_EXECUTOR_ADDRESS,
    target: SCHEDULED_ORDERS_EXECUTOR_ADDRESS,
    value: BigInt(0),
    callData: data,
    data,
  }
}

export const getSwapOrderData = ({ recurringOrder }: Params): Hex => {
  return encodeAbiParameters(
    [
      { name: 'tokenIn', type: 'address' },
      { name: 'tokenOut', type: 'address' },
      { name: 'amountIn', type: 'uint256' },
    ],
    [
      recurringOrder.buyToken.token_address as Address,
      recurringOrder.sellToken.token_address as Address,
      BigInt(recurringOrder.amount * 10 ** recurringOrder.sellToken.decimals),
    ],
  )
}

type ExecuteOrderParams = {
  jobId: number
}

export const getExecuteScheduledOrderAction = ({
  jobId,
}: ExecuteOrderParams): Execution => {
  const swapDetails = getSwapDetails()
  const data = encodeFunctionData({
    functionName: 'executeOrder',
    abi,
    args: [
      BigInt(jobId),
      swapDetails.sqrtPriceLimitX96,
      swapDetails.amountOutMin,
      swapDetails.fee,
    ],
  })

  return {
    to: SCHEDULED_ORDERS_EXECUTOR_ADDRESS,
    target: SCHEDULED_ORDERS_EXECUTOR_ADDRESS,
    value: BigInt(0),
    callData: data,
    data,
  }
}
