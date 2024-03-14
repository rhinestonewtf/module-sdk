import { PublicClient } from 'viem'
import { Account } from '../types'
import { Module } from '../../module/types'
import { getAccountImplementation } from './getAccountImplementation'

export const isModuleInstalled = ({
  client,
  account,
  module,
}: {
  client: PublicClient
  account: Account
  module: Module
}): Promise<boolean> => {
  const accountImplementation = getAccountImplementation({ account })
  return accountImplementation.isModuleInstalled({ client, account, module })
}
