import { Hex } from 'viem'
import { Account } from '../types'
import { getAccountImplementation } from './getAccountImplementation'
import { Module } from '../../module/types'

export const encodeModuleInstallationData = ({
  account,
  module,
}: {
  account: Account
  module: Module
}): Hex => {
  const accountImplementation = getAccountImplementation({ account })
  return accountImplementation.encodeModuleInstallationData({
    account,
    module,
  })
}
