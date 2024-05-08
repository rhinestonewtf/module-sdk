import { Address, encodePacked } from 'viem'
import { Module } from '../types'
import { REGISTRY_HOOK_ADDRESS } from './constants'

export const getInstallRegistryHook = ({
  registryAddress,
}: {
  registryAddress: Address
}): Module => {
  return {
    module: REGISTRY_HOOK_ADDRESS,
    data: encodePacked(['address'], [registryAddress]),
    additionalContext: '0x',
    type: 'hook',
  }
}
