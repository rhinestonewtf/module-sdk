import { Hex, encodeAbiParameters } from 'viem'
import { Module } from '../types'
import { SCHEDULED_TRANSFERS_EXECUTER_ADDRESS } from './constants'

export type WebauthnCredential = {
  id: string
  publicKey: [Hex, Hex]
}

type Params = {
  executeInterval: number
  numberOfExecutions: number
  startDate: number
  executionData: Hex
}

export const getScheduledTransfersExecutor = ({
  executeInterval,
  numberOfExecutions,
  startDate,
  executionData,
}: Params): Module => {
  return {
    module: SCHEDULED_TRANSFERS_EXECUTER_ADDRESS,
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
