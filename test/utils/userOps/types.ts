import { Address, Hex } from 'viem'

export type Network = {
  name: string
  testnet: boolean
  icon: string
  bundlerUrl: string
  rpcUrl: string
  zeroExBaseUrl: string
  id: number
  network: string
  nativeCurrency: { name: string; symbol: string; decimals: number }
  rpcUrls: {
    default: {
      http: string[]
    }
    public: {
      http: string[]
    }
  }
  queryName: string
  blockExplorerUrl: string
  explorerName: string
}

export type Account = {
  address: Address
  initCode: Hex
  deployedOnNetworks: number[]
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
