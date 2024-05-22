import { Account } from 'src/account'
import { Address, Hex } from 'viem'

export type Network = {
  id: number
}

export type Validator = {
  name: 'webauthn' | 'ecdsa' | 'mock'
  address: Address
  mockSignature: Hex
  signMessageAsync: (message: Hex, activeAccount: Account) => Promise<Hex>
}

export type ExecuteAction = {
  target: Address
  value: BigInt
  callData: Hex
}

export type TransactionDetailsForUserOp = {
  actions: ExecuteAction[]
  gasLimit?: BigInt
  maxFeePerGas?: BigInt
  maxPriorityFeePerGas?: BigInt
}

export type ValidatorList = {
  [name: string]: Validator
}

export type createAndSubmitUserOpParams = {
  actions: ExecuteAction[]
  network: Network
  activeAccount: Account
  chosenValidator?: Validator
}
