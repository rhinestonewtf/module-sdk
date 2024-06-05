import {
  Address,
  Hex,
  encodeAbiParameters,
  encodeFunctionData,
  encodePacked,
} from 'viem'
import { SCHEDULED_ORDERS_EXECUTER_ADDRESS } from './constants'
import { RecurringOrder } from './types'
import { Execution } from '../../account/types'
import { abi } from './abi'

type Params = {
  recurringOrder: RecurringOrder
}

export const getCreateScheduledOrderAction = ({
  recurringOrder,
}: Params): Execution => {
  return {
    target: SCHEDULED_ORDERS_EXECUTER_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
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
