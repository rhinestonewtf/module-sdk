import { Address, encodePacked } from 'viem'
import { Module } from '../types'
import { OWNABLE_EXECUTOR_ADDRESS } from './constants'

export const getOwnableExecutor = ({
  owner,
  hook,
}: {
  owner: Address
  hook?: Address
}): Module => {
  return {
    address: OWNABLE_EXECUTOR_ADDRESS,
    module: OWNABLE_EXECUTOR_ADDRESS,
    initData: encodePacked(['address'], [owner]),
    deInitData: '0x',
    additionalContext: '0x',
    type: 'executor',
    hook,
  }
}
