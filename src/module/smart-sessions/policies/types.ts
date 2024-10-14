import { Hex, Address } from 'viem'

export type Policy = {
  policy: Address
  address: Address
  initData: Hex
}
