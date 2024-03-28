import {
  Address,
  Hex,
  encodeAbiParameters,
  encodeFunctionData,
  parseAbi,
} from 'viem'
import {
  SCHEDULED_ORDERS_EXECUTER_ADDRESS,
  scheduledOrdersAbi,
} from './constants'
import { RecurringOrder } from './types'
import { Execution } from '../../account/types'

type Params = {
  recurringOrder: RecurringOrder
}

export const getCreateRecurringOrderExecution = ({
  recurringOrder,
}: Params): Execution => {
  return {
    target: SCHEDULED_ORDERS_EXECUTER_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'addOrder',
      abi: parseAbi(scheduledOrdersAbi),
      args: [
        {
          executeInterval: BigInt(
            recurringOrder.repeatEvery
          ),
          numberOfExecutions: BigInt(recurringOrder.numberOfRepeats),
          numberOfExecutionsCompleted: BigInt(0),
          startDate: BigInt(recurringOrder.startDate),
          isEnabled: true,
          lastExecutionTime: BigInt(0),
          executionData: getSwapOrderData({
            recurringOrder,
          }),
        },
      ],
    }),
  }
}

export const getSwapOrderData = ({ recurringOrder }: Params): Hex => {
  return encodeAbiParameters(
    [
      { name: 'tokenIn', type: 'address' },
      { name: 'tokenOut', type: 'address' },
      { name: 'amountIn', type: 'uint256' },
      { name: 'sqrtPriceLimitX96', type: 'uint160' },
    ],
    [
      recurringOrder.buyToken.token_address as Address,
      recurringOrder.sellToken.token_address as Address,
      BigInt(recurringOrder.amount * 10 ** recurringOrder.sellToken.decimals),
      BigInt(0),
    ],
  )
}
