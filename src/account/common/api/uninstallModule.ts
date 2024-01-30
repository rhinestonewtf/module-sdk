import { PublicClient, encodeFunctionData } from 'viem'
import { Account, Action } from '../Account'
import { Module } from '../../../module/common/Module'
import { getAccountImplementation } from './getAccountImplementation'

export const uninstallModule = ({
  client,
  account,
  module,
}: {
  client: PublicClient
  account: Account
  module: Module
}): Promise<Action[]> => {
  const accountImplementation = getAccountImplementation({ account })
  return accountImplementation.uninstallModule({ client, account, module })
}
