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
  startDate: string
  repeatEvery: number
  repeatType: 'day' | 'week' | 'month' | 'year'
  numberOfRepeats: number
}

export type ERC20Token = {
  name: string
  symbol: string
  token_address: string
  decimals: number
  chainId: number
  balance?: string
  logoURI?: string
}
