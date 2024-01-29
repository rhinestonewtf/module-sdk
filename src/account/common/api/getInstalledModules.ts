import { Address, PublicClient } from 'viem'
import { Account, Action } from '../Account'

export const getInstalledModules = async ({
  client,
  account,
}: {
  client: PublicClient
  account: Account
}): Promise<Address[]> => {
  const modules: Address[] = []
  // todo
  return modules
}
