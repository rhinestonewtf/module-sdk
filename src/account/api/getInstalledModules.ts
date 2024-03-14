import { Address, PublicClient } from 'viem'
import { Account } from '../types'
import { ModuleType } from '../../module/types'
import { getAccountImplementation } from './getAccountImplementation'

export const getInstalledModules = async ({
  client,
  account,
  moduleTypes,
}: {
  client: PublicClient
  account: Account
  moduleTypes?: ModuleType[]
}): Promise<Address[]> => {
  const accountImplementation = getAccountImplementation({ account })
  return accountImplementation.getInstalledModules({
    client,
    account,
    moduleTypes,
  })
}
