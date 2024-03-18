import { Hex } from 'viem'
import { ERC20Token, Schedule } from '../scheduled-orders/types'

export type ScheduledTransaction = Schedule & {
  token: ERC20Token
  amount: number
  recipient: Hex
  maxGasPrice?: number
}
