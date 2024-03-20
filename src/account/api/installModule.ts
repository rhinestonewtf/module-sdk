import { Account, Execution } from '../types'
import { PublicClient } from 'viem'
import { Module } from '../../module/types'
import { getAccountImplementation } from './getAccountImplementation'

export const installModule = ({
  client,
  account,
  module,
}: {
  client: PublicClient
  account: Account
  module: Module
}): Promise<Execution[]> => {
  const accountImplementation = getAccountImplementation({ account })
  return accountImplementation.installModule({ client, account, module })
}
