import { Address, PublicClient } from 'viem'
import { Account } from '../../types'
import { getInstalledModules as getInstalledModulesQuery } from '../../../common/queries'

export const getInstalledModules = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<Address[]> => {
  return getInstalledModulesQuery({ account, client })
}
