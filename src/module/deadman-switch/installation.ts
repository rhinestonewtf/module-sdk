import { Address, encodePacked, PublicClient } from 'viem'
import { Module } from '../types'
import { DEADMAN_SWITCH_ADDRESS } from './constants'
import { abi } from './abi'
import { Account } from '../../account'

export const getDeadmanSwitch = async ({
  moduleType,
  nominee,
  timeout,
  hook,
  account,
  client,
}: {
  nominee: Address
  timeout: number
  moduleType: 'hook' | 'validator'
  hook?: Address
  account: Account
  client: PublicClient
}): Promise<Module> => {
  const isInitialized = (await client.readContract({
    address: DEADMAN_SWITCH_ADDRESS,
    abi,
    functionName: 'isInitialized',
    args: [account.address],
  })) as boolean

  return {
    address: DEADMAN_SWITCH_ADDRESS,
    module: DEADMAN_SWITCH_ADDRESS,
    initData: isInitialized
      ? '0x'
      : encodePacked(['address', 'uint48'], [nominee, timeout]),
    deInitData: '0x',
    additionalContext: '0x',
    type: moduleType,
    hook,
  }
}
