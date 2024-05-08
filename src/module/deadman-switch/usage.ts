import { DEADMAN_SWITCH_ADDRESS } from './constants'
import { Address, PublicClient } from 'viem'
import { Account } from '../../account/types'
import { abi } from './abi'

type ConfigType = [number, number, Address]

export const getConfig = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<ConfigType> => {
  try {
    const config = (await client.readContract({
      address: DEADMAN_SWITCH_ADDRESS,
      abi,
      functionName: 'config',
      args: [account.address],
    })) as ConfigType

    return config
  } catch (err) {
    throw new Error('Error getting config')
  }
}
