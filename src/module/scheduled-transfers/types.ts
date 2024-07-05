import { Address } from 'viem'
import { ERC20Token, Schedule } from '../scheduled-orders/types'

export type ScheduledTransfer = Schedule & {
  token?: ERC20Token
  amount: number
  recipient: Address
  maxGasPrice?: number
}
