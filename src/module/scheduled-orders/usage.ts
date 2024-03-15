import { Address, Hex, encodeAbiParameters, encodeFunctionData } from 'viem'
import ScheduledOrdersInterface from './abis/ScheduledOrdersInterface.json'
import { SCHEDULED_ORDERS_EXECUTER_ADDRESS } from './constants'
import { RecurringOrder } from './types'
import { Action } from '../../Account/types'
import moment from 'moment'

type Params = {
  recurringOrder: RecurringOrder
}

export const getCreateRecurringOrderAction = ({
  recurringOrder,
}: Params): Action => {
  return {
    target: SCHEDULED_ORDERS_EXECUTER_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'addOrder',
      abi: ScheduledOrdersInterface,
      args: [
        {
          executeInterval: BigInt(
            moment
              .duration(recurringOrder.repeatEvery, recurringOrder.repeatType)
              .asSeconds(),
          ),
          numberOfExecutions: BigInt(recurringOrder.numberOfRepeats),
          numberOfExecutionsCompleted: BigInt(0),
          startDate: BigInt(moment(recurringOrder.startDate).valueOf()),
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
