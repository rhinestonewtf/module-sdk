import { Address, encodeAbiParameters } from 'viem'
import { Module } from '../types'
import { SMART_SESSIONS_ADDRESS } from './constants'
import { Session } from './types'
import { installSmartSessionsAbi } from './abi'

type Params = {
  sessions?: Session[]
  hook?: Address
}

export const getSmartSessionsValidator = ({
  sessions,
  hook,
}: Params): Module => {
  return {
    address: SMART_SESSIONS_ADDRESS,
    module: SMART_SESSIONS_ADDRESS,
    initData: sessions?.length
      ? encodeAbiParameters(installSmartSessionsAbi, [sessions])
      : '0x',
    deInitData: '0x',
    additionalContext: '0x',
    type: 'validator',
    hook,
  }
}
