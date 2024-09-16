import { Hex } from 'viem'
import { Account, ERC1271SignatureParams } from '../types'
import { getAccountImplementation } from './getAccountImplementation'

export const encode1271Signature = ({
  account,
  signatureParams,
}: {
  account: Account
  signatureParams: ERC1271SignatureParams
}): Hex => {
  const accountImplementation = getAccountImplementation({ account })
  return accountImplementation.encode1271Signature(signatureParams)
}
