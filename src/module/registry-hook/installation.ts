import { Address, encodePacked } from 'viem'
import { Module } from '../types'
import { GLOBAL_CONSTANTS } from '../../constants'

export const getRegistryHook = ({
  registryAddress,
}: {
  registryAddress: Address
}): Module => {
  return {
    address: GLOBAL_CONSTANTS.REGISTRY_HOOK_ADDRESS,
    module: GLOBAL_CONSTANTS.REGISTRY_HOOK_ADDRESS,
    initData: encodePacked(['address'], [registryAddress]),
    deInitData: '0x',
    additionalContext: '0x',
    type: 'hook',
  }
}
