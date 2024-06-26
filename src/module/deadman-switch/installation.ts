import { Address, encodePacked } from 'viem'
import { Module } from '../types'
import { DEADMAN_SWITCH_ADDRESS } from './constants'

export const getInstallDeadmanSwitch = ({
  moduleType,
  nominee,
  timeout,
  hook,
}: {
  nominee: Address
  timeout: number
  moduleType: 'hook' | 'validator'
  hook?: Address
}): Module => {
  return {
    module: DEADMAN_SWITCH_ADDRESS,
    data: encodePacked(['address', 'uint48'], [nominee, timeout]),
    additionalContext: '0x',
    type: moduleType,
    hook,
  }
}
