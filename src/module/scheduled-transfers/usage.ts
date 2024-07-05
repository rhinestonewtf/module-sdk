import {
  Address,
  Hex,
  encodeAbiParameters,
  encodeFunctionData,
  encodePacked,
  erc20Abi,
} from 'viem'
import { ScheduledTransfer } from './types'
import { Execution } from '../../account/types'
import { SCHEDULED_TRANSFERS_EXECUTER_ADDRESS } from './constants'
import { abi } from './abi'

type Params = {
  scheduledTransfer: ScheduledTransfer
}

export const getScheduledTransferData = ({
  scheduledTransfer,
}: Params): Hex => {
  const amount = BigInt(
    Number(scheduledTransfer.amount) *
      10 ** (scheduledTransfer.token?.decimals || 18),
  )

  return encodeAbiParameters(
    [
      { name: 'target', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'callData', type: 'bytes' },
    ],
    [
      scheduledTransfer.token
        ? (scheduledTransfer.token.token_address as Address)
        : (scheduledTransfer.recipient as Address),
      scheduledTransfer.token ? BigInt(0) : amount,
      scheduledTransfer.token
        ? encodeFunctionData({
            functionName: 'transfer',
            abi: erc20Abi,
            args: [scheduledTransfer.recipient as Address, amount],
          })
        : '0x',
    ],
  )
}

type CreateScheduledTransferExecutionParams = {
  scheduledTransfer: ScheduledTransfer
}

export const getCreateScheduledTransferAction = ({
  scheduledTransfer,
}: CreateScheduledTransferExecutionParams): Execution => {
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
            scheduledTransfer.repeatEvery,
            scheduledTransfer.numberOfRepeats,
            scheduledTransfer.startDate,
            getScheduledTransferData({ scheduledTransfer }),
          ],
        ),
      ],
    }),
  }
}
