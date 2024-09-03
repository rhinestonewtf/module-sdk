import { Hex, Address } from 'viem'

export type Policy = {
  address: Address
  initData: Hex
  deInitData: Hex
}
