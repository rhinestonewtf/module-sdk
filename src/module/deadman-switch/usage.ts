import { DEADMAN_SWITCH_ADDRESS } from './constants'
import { Address, PublicClient } from 'viem'
import { Account } from '../../account/types'
import { abi } from './abi'

export type DeadmanSwitchConfigType = [number, number, Address]

export const getConfig = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<DeadmanSwitchConfigType> => {
  try {
    const config = (await client.readContract({
      address: DEADMAN_SWITCH_ADDRESS,
      abi,
      functionName: 'config',
      args: [account.address],
    })) as DeadmanSwitchConfigType

    return config
  } catch (err) {
    throw new Error('Error getting config')
  }
}
