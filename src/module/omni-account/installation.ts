import { Address, encodeAbiParameters } from 'viem'
import {
  ACCOUNT_LOCKER_HOOK,
  ACCOUNT_LOCKER_SOURCE_EXECUTOR,
  ACCOUNT_LOCKER_TARGET_EXECUTOR,
} from './constants'
import { Module } from '../types'

export const getAccountLockerHook = (
  { isOmniMode, hook }: { hook?: Address; isOmniMode: boolean } = {
    isOmniMode: false,
  },
): Module => {
  return {
    module: ACCOUNT_LOCKER_HOOK,
    address: ACCOUNT_LOCKER_HOOK,
    initData: isOmniMode
      ? encodeAbiParameters(
          [
            { name: 'hookType', type: 'uint256' },
            { name: 'hookId', type: 'bytes4' },
            { name: 'data', type: 'bytes' },
          ],
          [
            0n,
            '0x00000000',
            encodeAbiParameters([{ name: 'value', type: 'bool' }], [true]),
          ],
        )
      : '0x',
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
    address: ACCOUNT_LOCKER_SOURCE_EXECUTOR,
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
    module: ACCOUNT_LOCKER_TARGET_EXECUTOR,
    address: ACCOUNT_LOCKER_TARGET_EXECUTOR,
    initData:
      moduleType === 'executor'
        ? '0x'
        : encodeAbiParameters(
            [
              { name: 'selector', type: 'bytes4' },
              { name: 'flags', type: 'bytes1' },
              { name: 'data', type: 'bytes' },
            ],
            ['0x3a5be8cb', '0x00', '0x'],
          ),
    deInitData: '0x',
    additionalContext: '0x',
    hook,
    type: moduleType,
  }
}
