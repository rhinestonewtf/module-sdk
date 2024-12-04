import { Address, Hex } from 'viem'

export type WithdrawRequest = {
  timestamp: number
  tokenAddress: Address
  orchestrator: Address
  amount: bigint
  nonce: bigint
}

export type CrossChainOrder = {
  settlementContract: Address
  swapper: Address
  nonce: bigint
  originChainId: number
  initiateDeadline: number
  fillDeadline: number
  orderData: Hex
}

export type ApprovalSpend = {
  account: Address
  token: Address
  amount: bigint
}
