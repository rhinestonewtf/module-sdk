import { Address, encodeAbiParameters } from 'viem'
import { Module } from '../types'
import { GLOBAL_CONSTANTS } from '../../constants'

export const getAccountLockerHook = (
  { isOmniMode, hook }: { hook?: Address; isOmniMode: boolean } = {
    isOmniMode: false,
  },
): Module => {
  return {
    module: GLOBAL_CONSTANTS.ACCOUNT_LOCKER_HOOK,
    address: GLOBAL_CONSTANTS.ACCOUNT_LOCKER_HOOK,
    initData: encodeAbiParameters(
      [{ name: 'enableOmniLock', type: 'bool' }],
      [isOmniMode],
    ),
    deInitData: '0x',
    additionalContext: '0x',
    hook,
    type: 'hook',
  }
}

export const getAccountLockerSourceExecutor = ({
  hook,
}: {
  hook?: Address
} = {}): Module => {
  return {
    module: GLOBAL_CONSTANTS.ACCOUNT_LOCKER_SOURCE_EXECUTOR,
    address: GLOBAL_CONSTANTS.ACCOUNT_LOCKER_SOURCE_EXECUTOR,
    initData: '0x',
    deInitData: '0x',
    additionalContext: '0x',
    hook,
    type: 'executor',
  }
}

export const getAccountLockerTargetExecutor = (
  {
    hook,
    moduleType,
  }: {
    hook?: Address
    moduleType: 'fallback' | 'executor'
  } = { moduleType: 'executor' },
): Module => {
  return {
    module: GLOBAL_CONSTANTS.ACCOUNT_LOCKER_TARGET_EXECUTOR,
    address: GLOBAL_CONSTANTS.ACCOUNT_LOCKER_TARGET_EXECUTOR,
    initData: '0x',
    deInitData: '0x',
    additionalContext: '0x',
    hook,
    type: moduleType,
  }
}
