import { Address, encodeAbiParameters, encodePacked, PublicClient } from 'viem'
import { Module } from '../types'
import {
  COLD_STORAGE_HOOK_ADDRESS,
  COLD_STORAGE_FLASHLOAN_ADDRESS,
} from './constants'
import { Account } from '../../account'
import { getInstalledModules } from '../../account'

type Params = {
  account: Account
  client: PublicClient
  waitPeriod: number
  owner: Address
  moduleType: 'hook' | 'fallback' | 'executor'
}

export const getInstallColdStorageHook = async ({
  account,
  client,
  waitPeriod,
  owner,
  moduleType,
}: Params): Promise<Module> => {
  const installedModules = await getInstalledModules({ account, client })

  const data = installedModules.includes(COLD_STORAGE_HOOK_ADDRESS)
    ? '0x'
    : encodePacked(['uint128', 'address'], [BigInt(waitPeriod), owner])

  return {
    module: COLD_STORAGE_HOOK_ADDRESS,
    data,
    additionalContext: '0x',
    type: moduleType,
  }
}

type FlashloanParams = {
  addresses: Address[]
}

export const getInstallAllowedCallbackSenders = ({
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
