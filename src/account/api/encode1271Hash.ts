import { Address, Hex } from 'viem'
import { Account, ERC1271HashParams } from '../types'
import { getAccountImplementation } from './getAccountImplementation'

export const encode1271Hash = ({
  account,
  chainId,
  validator,
  hash,
}: {
  account: Account
  chainId: number
  validator: Address
  hash: Hex
}): Hex => {
  const accountImplementation = getAccountImplementation({ account })
  return accountImplementation.encode1271Hash({
    account: account.address,
    chainId,
    validator,
    hash,
  })
}
