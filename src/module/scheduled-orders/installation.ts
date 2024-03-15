import { Hex, encodeAbiParameters } from 'viem'
import { Module } from '../types'
import { SCHEDULED_ORDERS_EXECUTER_ADDRESS } from './constants'

type Params = {
  executeInterval: number
  numberOfExecutions: number
  startDate: number
  executionData: Hex
}

export const getScheduledOrdersExecutor = ({
  executeInterval,
  numberOfExecutions,
  startDate,
  executionData,
}: Params): Module => {
  return {
    module: SCHEDULED_ORDERS_EXECUTER_ADDRESS,
    type: 'executor',
    data: encodeAbiParameters(
      [
        { name: 'executeInterval', type: 'uint48' },
        { name: 'numberOfExecutions', type: 'uint16' },
        { name: 'startDate', type: 'uint48' },
        { name: 'executionData', type: 'bytes' },
      ],
      [executeInterval, numberOfExecutions, startDate, executionData],
    ),
  }
}
