import { Address, parseAbi, PublicClient, zeroAddress } from 'viem'
import { Account } from '../../types'
import { getInstalledModules as getInstalledModulesQuery } from '../../../common/queries/account'
import { accountAbi } from '../constants/abis'
import { SENTINEL_ADDRESS } from '../../../common/constants'

export const getInstalledModules = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<Address[]> => {
  let installedModules: Address[] = []
  try {
    installedModules = await getInstalledModulesQuery({
      account,
      client,
    })
  } catch (e) {}
  if (installedModules.length === 0) {
    const installedValidators = (await client.readContract({
      address: account.address,
      abi: parseAbi(accountAbi),
      functionName: 'getValidatorsPaginated',
      args: [SENTINEL_ADDRESS, 100],
    })) as Address[]
    for (const validator of installedValidators) {
      installedModules.push(validator)
    }

    const installedExecutors = (await client.readContract({
      address: account.address,
      abi: parseAbi(accountAbi),
      functionName: 'getExecutorsPaginated',
      args: [SENTINEL_ADDRESS, 100],
    })) as Address[]

    for (const executor of installedExecutors) {
      installedModules.push(executor)
    }

    const installedHook = (await client.readContract({
      address: account.address,
      abi: parseAbi(accountAbi),
      functionName: 'getActiveHook',
    })) as Address

    if (installedHook != zeroAddress) {
      installedModules.push(installedHook)
    }
  }
  return installedModules
}
