import { Address, Hex } from 'viem'
import { Account, AccountType } from '../types'

export const getAccount = ({
  address,
  initCode,
  type,
}: {
  address: Address
  initCode?: Hex
  type: AccountType
}): Account => {
  return {
    address,
    initCode,
    type,
  }
}
