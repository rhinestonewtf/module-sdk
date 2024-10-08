import { Address, Hex, encodePacked } from 'viem'
import { Module } from '../types'
import { SCHEDULED_TRANSFERS_EXECUTOR_ADDRESS } from './constants'

type Params = {
  executeInterval: number
  numberOfExecutions: number
  startDate: number
  executionData: Hex
  hook?: Address
}

export const getScheduledTransfersExecutor = ({
  executeInterval,
  numberOfExecutions,
  startDate,
  executionData,
  hook,
}: Params): Module => {
  return {
    address: SCHEDULED_TRANSFERS_EXECUTOR_ADDRESS,
    module: SCHEDULED_TRANSFERS_EXECUTOR_ADDRESS,
    type: 'executor',
    initData: encodePacked(
      ['uint48', 'uint16', 'uint48', 'bytes'],
      [executeInterval, numberOfExecutions, startDate, executionData],
    ),
    deInitData: '0x',
    additionalContext: '0x',
    hook,
  }
}
