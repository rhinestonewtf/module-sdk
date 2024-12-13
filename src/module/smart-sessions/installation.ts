import { Address, encodeAbiParameters, encodePacked } from 'viem'
import { Module } from '../types'
import {
  SMART_SESSIONS_ADDRESS,
  SMART_SESSIONS_COMPATIBILITY_FALLBACK_ADDRESS,
} from './constants'
import { Session } from './types'
import { installSmartSessionsAbi } from './abi'
import { SmartSessionMode } from './types'
import { CallType } from '../../module/types'

type Params = {
  sessions?: Session[]
  useRegistry?: boolean
  hook?: Address
}

export const getSmartSessionsValidator = ({
  sessions,
  useRegistry = true,
  hook,
}: Params): Module => {
  return {
    address: SMART_SESSIONS_ADDRESS,
    module: SMART_SESSIONS_ADDRESS,
    initData: sessions?.length
      ? encodePacked(
          ['bytes1', 'bytes'],
          [
            useRegistry
              ? SmartSessionMode.ENABLE
              : SmartSessionMode.UNSAFE_ENABLE,
            encodeAbiParameters(installSmartSessionsAbi, [sessions]),
          ],
        )
      : '0x',
    deInitData: '0x',
    additionalContext: '0x',
    type: 'validator',
    hook,
  }
}

export const getSmartSessionsCompatibilityFallback = (): Module => {
  return {
    address: SMART_SESSIONS_COMPATIBILITY_FALLBACK_ADDRESS,
    module: SMART_SESSIONS_COMPATIBILITY_FALLBACK_ADDRESS,
    initData: '0x',
    deInitData: '0x',
    selector: '0x84b0196e',
    callType: CallType.CALLTYPE_SINGLE,
    additionalContext: '0x',
    type: 'fallback',
  }
}
