import { Hex, PublicClient } from 'viem'
import { Account } from '../types'
import { getAccountImplementation } from './getAccountImplementation'
import { Module } from '../../module/types'

export const encodeValidatorNonce = ({
  account,
  validator,
}: {
  account: Account
  validator: Module
}): bigint => {
  const accountImplementation = getAccountImplementation({ account })
  return accountImplementation.encodeValidatorNonce({
    validator,
  })
}
