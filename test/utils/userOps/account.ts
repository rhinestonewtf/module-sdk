import { Address, Hex } from 'viem'
import { Account } from './types'

export const getAccount = ({
  address,
  initCode = '0x',
  deployedOnNetworks = [],
}: {
  address: Address
  initCode?: Hex
  deployedOnNetworks?: number[]
}): Account => {
  return {
    address,
    initCode,
    deployedOnNetworks,
  }
}
