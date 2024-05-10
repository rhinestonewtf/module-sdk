import { Hex, encodePacked } from 'viem'
import { Module } from '../types'
import { SCHEDULED_ORDERS_EXECUTER_ADDRESS } from './constants'

type Params = {
  executeInterval: number
  numberOfExecutions: number
  startDate: number
  executionData: Hex
}

export const getInstallScheduledOrdersExecutor = ({
  executeInterval,
  numberOfExecutions,
  startDate,
  executionData,
}: Params): Module => {
  return {
    module: SCHEDULED_ORDERS_EXECUTER_ADDRESS,
    type: 'executor',
    data: encodePacked(
      ['uint48', 'uint16', 'uint48', 'bytes'],
      [executeInterval, numberOfExecutions, startDate, executionData],
    ),
  }
}
