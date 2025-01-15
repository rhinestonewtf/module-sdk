import { Address, encodePacked } from 'viem'
import { Module } from '../types'
import { GLOBAL_CONSTANTS } from '../../constants'

export const getOwnableExecutor = ({
  owner,
  hook,
}: {
  owner: Address
  hook?: Address
}): Module => {
  return {
    address: GLOBAL_CONSTANTS.OWNABLE_EXECUTOR_ADDRESS,
    module: GLOBAL_CONSTANTS.OWNABLE_EXECUTOR_ADDRESS,
    initData: encodePacked(['address'], [owner]),
    deInitData: '0x',
    additionalContext: '0x',
    type: 'executor',
    hook,
  }
}
