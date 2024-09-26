import { Address } from 'viem'
import { Module } from '../types'
import {
  ACCOUNT_LOCKER_HOOK,
  ACCOUNT_LOCKER_SOURCE_EXECUTOR,
  ACCOUNT_LOCKER_TARGET_EXECUTOR,
} from './constants'

export const getAccountLockerHook = ({
  hook,
}: { hook?: Address } = {}): Module => {
  return {
    module: ACCOUNT_LOCKER_HOOK,
    initData: '0x',
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
    module: ACCOUNT_LOCKER_SOURCE_EXECUTOR,
    initData: '0x',
    deInitData: '0x',
    additionalContext: '0x',
    hook,
    type: 'executor',
  }
}

export const getAccountLockerTargetExecutor = ({
  hook,
}: {
  hook?: Address
} = {}): Module => {
  return {
    module: ACCOUNT_LOCKER_TARGET_EXECUTOR,
    initData: '0x',
    deInitData: '0x',
    additionalContext: '0x',
    hook,
    type: 'executor',
  }
}
