import { Address, Hex } from 'viem'
import { Account, ERC1271SignatureParams } from '../types'
import { getAccountImplementation } from './getAccountImplementation'

export const encode1271Signature = ({
  account,
  validator,
  signature,
}: {
  account: Account
  validator: Address
  signature: Hex
}): Hex => {
  const accountImplementation = getAccountImplementation({ account })
  return accountImplementation.encode1271Signature({
    account: account.address,
    validator,
    signature,
  })
}
