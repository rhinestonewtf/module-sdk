import { Account, Action } from '../types'
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
}): Promise<Action[]> => {
  const accountImplementation = getAccountImplementation({ account })
  return accountImplementation.installModule({ client, account, module })
}
