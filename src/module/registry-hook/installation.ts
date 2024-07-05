import { Address, encodePacked } from 'viem'
import { Module } from '../types'
import { REGISTRY_HOOK_ADDRESS } from './constants'

export const getRegistryHook = ({
  registryAddress,
}: {
  registryAddress: Address
}): Module => {
  return {
    module: REGISTRY_HOOK_ADDRESS,
    initData: encodePacked(['address'], [registryAddress]),
    deInitData: '0x',
    additionalContext: '0x',
    type: 'hook',
  }
}
