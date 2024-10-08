import {
  Address,
  encodeAbiParameters,
  encodePacked,
  Hex,
  PublicClient,
} from 'viem'
import { Module } from '../types'
import {
  COLD_STORAGE_HOOK_ADDRESS,
  COLD_STORAGE_FLASHLOAN_ADDRESS,
} from './constants'
import { Account } from '../../account'
import { getInstalledModules } from '../../account'
import { CallType } from '../../module/types'

type Params = {
  account: Account
  client: PublicClient
  waitPeriod: number
  owner: Address
  moduleType: 'hook' | 'fallback' | 'executor'
  hook?: Address
}

export const getColdStorageHook = async ({
  account,
  client,
  waitPeriod,
  owner,
  moduleType,
  hook,
}: Params): Promise<Module> => {
  const installedModules = await getInstalledModules({ account, client })

  const initData = installedModules.includes(COLD_STORAGE_HOOK_ADDRESS)
    ? '0x'
    : encodePacked(['uint128', 'address'], [BigInt(waitPeriod), owner])

  return {
    address: COLD_STORAGE_HOOK_ADDRESS,
    module: COLD_STORAGE_HOOK_ADDRESS,
    initData,
    deInitData: '0x',
    additionalContext: '0x',
    type: moduleType,
    hook,
  }
}

type FlashloanParams = {
  addresses: Address[]
  functionSig?: Hex
  callType: CallType
  selector?: Hex
  hook?: Address
}

export const getAllowedCallbackSenders = ({
  addresses,
  functionSig,
  callType,
  selector,
  hook,
}: FlashloanParams): Module => {
  return {
    address: COLD_STORAGE_FLASHLOAN_ADDRESS,
    module: COLD_STORAGE_FLASHLOAN_ADDRESS,
    initData: encodeAbiParameters(
      [{ internalType: 'address[]', name: 'addresses', type: 'address[]' }],
      [addresses],
    ),
    deInitData: '0x',
    functionSig,
    additionalContext: '0x',
    selector,
    hook,
    callType,
    type: 'fallback',
  }
}
