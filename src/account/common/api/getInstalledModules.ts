import { Address, PublicClient } from 'viem'
import { Account } from '../Account'

export const getInstalledModules = async ({
  client,
  account,
}: {
  client: PublicClient
  account: Account
}): Promise<Address[]> => {
  // todo
}
