import {
  Address,
  Hex,
  encodeAbiParameters,
  encodeFunctionData,
  encodePacked,
  erc20Abi,
} from 'viem'
import { ScheduledTransaction } from './types'
import { Execution } from '../../account/types'
import { SCHEDULED_TRANSFERS_EXECUTER_ADDRESS } from './constants'
import { abi } from './abi'

type Params = {
  scheduledTransaction: ScheduledTransaction
}

export const getScheduledTransactionData = ({
  scheduledTransaction,
}: Params): Hex => {
  const amount = BigInt(
    Number(scheduledTransaction.amount) *
      10 ** (scheduledTransaction.token?.decimals || 18),
  )

  return encodeAbiParameters(
    [
      { name: 'target', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'callData', type: 'bytes' },
    ],
    [
      scheduledTransaction.token
        ? (scheduledTransaction.token.token_address as Address)
        : (scheduledTransaction.recipient as Address),
      scheduledTransaction.token ? BigInt(0) : amount,
      scheduledTransaction.token
        ? encodeFunctionData({
            functionName: 'transfer',
            abi: erc20Abi,
            args: [scheduledTransaction.recipient as Address, amount],
          })
        : '0x',
    ],
  )
}

type CreateScheduledTransactionExecutionParams = {
  scheduledTransaction: ScheduledTransaction
}

export const getCreateScheduledTransferExecution = ({
  scheduledTransaction,
}: CreateScheduledTransactionExecutionParams): Execution => {
  return {
    target: SCHEDULED_TRANSFERS_EXECUTER_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'addOrder',
      abi,
      args: [
        encodePacked(
          ['uint48', 'uint16', 'uint48', 'bytes'],
          [
            scheduledTransaction.repeatEvery,
            scheduledTransaction.numberOfRepeats,
            scheduledTransaction.startDate,
            getScheduledTransactionData({ scheduledTransaction }),
          ],
        ),
      ],
    }),
  }
}
