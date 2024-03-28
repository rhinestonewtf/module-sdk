import { Address } from 'viem'

export type RecurringOrder = Order & Schedule

export type Order = {
  buyToken: ERC20Token
  sellToken: ERC20Token
  amount: number
  orderType: 'buy' | 'sell'
  priceLimit?: string
  maxGasPrice?: string
  expirationDate?: string
}

export type Schedule = {
  startDate: number // Unix timestamp
  repeatEvery: number // In seconds
  numberOfRepeats: number
}

export type ERC20Token = {
  token_address: Address
  decimals: number
}
