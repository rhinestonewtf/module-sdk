import { Account } from 'src/account'
import { Address, Hex } from 'viem'

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

export type ValidatorList = {
  [name: string]: Validator
}
