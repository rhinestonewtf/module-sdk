import { Address, encodeAbiParameters, encodePacked } from 'viem'
import { Module } from '../types'
import {
  COLD_STORAGE_HOOK_ADDRESS,
  COLD_STORAGE_FLASHLOAN_ADDRESS,
} from './constants'

type Params = {
  waitPeriod: number
  owner: Address
  moduleType: 'hook' | 'fallback' | 'executor'
}

export const getInstallColdStorageHook = ({
  waitPeriod,
  owner,
  moduleType,
}: Params): Module => {
  return {
    module: COLD_STORAGE_HOOK_ADDRESS,
    data: encodePacked(['uint128', 'address'], [BigInt(waitPeriod), owner]),
    additionalContext: '0x',
    type: moduleType,
  }
}

type FlashloanParams = {
  addresses: Address[]
}

export const getInstallColdStorageFlashloan = ({
  addresses,
}: FlashloanParams): Module => {
  return {
    module: COLD_STORAGE_FLASHLOAN_ADDRESS,
    data: encodeAbiParameters(
      [{ internalType: 'address[]', name: 'addresses', type: 'address[]' }],
      [addresses],
    ),
    additionalContext: '0x',
    type: 'fallback',
  }
}
