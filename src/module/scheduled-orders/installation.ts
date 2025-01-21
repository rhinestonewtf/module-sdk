import { Address, Hex, encodePacked } from 'viem'
import { Module } from '../types'
import { swapRouterAddresses } from '../utils/uniswap'
import { GLOBAL_CONSTANTS } from '../../constants'

type Params = {
  chainId: number
  executeInterval: number
  numberOfExecutions: number
  startDate: number
  executionData: Hex
  hook?: Address
}

export const getScheduledOrdersExecutor = ({
  chainId,
  executeInterval,
  numberOfExecutions,
  startDate,
  executionData,
  hook,
}: Params): Module => {
  const swapRouter: Address = swapRouterAddresses[chainId]
  if (!swapRouter) {
    throw new Error(`Swap router address not found for chainId ${chainId}`)
  }

  return {
    address: GLOBAL_CONSTANTS.SCHEDULED_ORDERS_EXECUTOR_ADDRESS,
    module: GLOBAL_CONSTANTS.SCHEDULED_ORDERS_EXECUTOR_ADDRESS,
    type: 'executor',
    initData: encodePacked(
      ['address', 'uint48', 'uint16', 'uint48', 'bytes'],
      [
        swapRouter,
        executeInterval,
        numberOfExecutions,
        startDate,
        executionData,
      ],
    ),
    deInitData: '0x',
    additionalContext: '0x',
    hook,
  }
}
