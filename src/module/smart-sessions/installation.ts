import { Address, encodeAbiParameters } from 'viem'
import { Module } from '../types'
import { SMART_SESSIONS_ADDRESS } from './constants'
import { Session } from './types'
import { installSmartSessionsAbi } from './abi'

type Params = {
  sessions: Session[]
  hook?: Address
}

export const getSmartSessionsValidator = ({
  sessions,
  hook,
}: Params): Module => {
  return {
    module: SMART_SESSIONS_ADDRESS,
    initData: encodeAbiParameters(installSmartSessionsAbi, [sessions]),
    deInitData: '0x',
    additionalContext: '0x',
    type: 'validator',
    hook,
  }
}
