import { Account, Action } from '../Account'
import { PublicClient } from 'viem'
import { Module } from '../../../module/common/Module'
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
