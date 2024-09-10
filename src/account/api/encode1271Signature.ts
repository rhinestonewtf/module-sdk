import { Hex } from 'viem'
import { Account, Signature1271Params } from '../types'
import { getAccountImplementation } from './getAccountImplementation'

export const encode1271Signature = ({
  account,
  signatureParams,
}: {
  account: Account
  signatureParams: Signature1271Params
}): Hex => {
  const accountImplementation = getAccountImplementation({ account })
  return accountImplementation.encode1271Signature(signatureParams)
}
