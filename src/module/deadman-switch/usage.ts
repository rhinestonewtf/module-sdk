import { DEADMAN_SWITCH_ADDRESS } from './constants'
import { Address, Hex, PublicClient } from 'viem'
import { Account } from '../../account/types'
import { abi } from './abi'

export type DeadmanSwitchConfigType = [number, number, Address]

export const getDeadmanSwitchConfig = async ({
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

export const getDeadmanSwitchValidatorMockSignature = (): Hex => {
  return '0xe8b94748580ca0b4993c9a1b86b5be851bfc076ff5ce3a1ff65bf16392acfcb800f9b4f1aef1555c7fce5599fffb17e7c635502154a0333ba21f3ae491839af51c'
}
