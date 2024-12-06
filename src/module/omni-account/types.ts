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

export type OriginModulePayload = {
  order: Order
  auctionFee: bigint
  orchestratorSig: Hex
  acrossMessagePayload: Hex
}

export type Order = {
  settlement: Settlement
  acrossTransfer: AcrossTransfer
  smartDigests: SmartDigest
  userSig: Hex
}

export type Settlement = {
  orchestrator: Address
  recipient: Address
  settlementContract: Address
  targetAccount: Address
  targetChainId: number
  fillDeadline: number
  lastDepositId: bigint
}

export type TokenTransfer = {
  tokenAddress: Address
  amount: bigint
}

export type AcrossTransfer = {
  originModule: Address
  originAccount: Address
  originChainId: number
  initiateDeadline: number
  maxFee: bigint
  depositId: bigint
  originTransfer: TokenTransfer
  targetTransfer: TokenTransfer
}

export type SmartDigest = {
  acrossTransferDigests: IndexChainDigest
  executionDigest: Hex
  userOpDigest: Hex
}

export type IndexChainDigest = {
  digestIndex: bigint
  chainDataDigests: Hex[]
}
