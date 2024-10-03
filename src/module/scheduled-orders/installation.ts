import { Address, Hex, encodePacked } from 'viem'
import { Module } from '../types'
import { SCHEDULED_ORDERS_EXECUTOR_ADDRESS } from './constants'

type Params = {
  executeInterval: number
  numberOfExecutions: number
  startDate: number
  executionData: Hex
  hook?: Address
}

export const getScheduledOrdersExecutor = ({
  executeInterval,
  numberOfExecutions,
  startDate,
  executionData,
  hook,
}: Params): Module => {
  return {
    module: SCHEDULED_ORDERS_EXECUTOR_ADDRESS,
    type: 'executor',
    initData: encodePacked(
      ['uint48', 'uint16', 'uint48', 'bytes'],
      [executeInterval, numberOfExecutions, startDate, executionData],
    ),
    deInitData: '0x',
    hook,
  }
}
