import {
  Address,
  Hex,
  encodeAbiParameters,
  encodeFunctionData,
  parseAbi,
} from 'viem'
import { ScheduledTransaction } from './types'
import moment from 'moment'
import { Action } from '../../account/types'
import { SCHEDULED_TRANSFERS_EXECUTER_ADDRESS } from './constants'
import ScheduledTransfersInterface from './abis/ScheduledTransfersInterface.json'

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
            abi: parseAbi([
              'function transfer(address to, uint256 value) external',
            ]),
            args: [scheduledTransaction.recipient as Address, amount],
          })
        : '0x',
    ],
  )
}

type CreateScheduledTransactionActionParams = {
  scheduledTransaction: ScheduledTransaction
}

export const getCreateScheduledTransferAction = ({
  scheduledTransaction,
}: CreateScheduledTransactionActionParams): Action => {
  return {
    target: SCHEDULED_TRANSFERS_EXECUTER_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'addOrder',
      abi: ScheduledTransfersInterface,
      args: [
        {
          executeInterval: BigInt(
            moment
              .duration(
                scheduledTransaction.repeatEvery,
                scheduledTransaction.repeatType,
              )
              .asSeconds(),
          ),
          numberOfExecutions: BigInt(scheduledTransaction.numberOfRepeats),
          numberOfExecutionsCompleted: BigInt(0),
          startDate: BigInt(moment(scheduledTransaction.startDate).valueOf()),
          isEnabled: true,
          lastExecutionTime: BigInt(0),
          executionData: getScheduledTransactionData({
            scheduledTransaction,
          }),
        },
      ],
    }),
  }
}
