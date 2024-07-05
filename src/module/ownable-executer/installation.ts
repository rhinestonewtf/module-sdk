import { Address, encodePacked } from 'viem'
import { Module } from '../types'
import { OWNABLE_EXECUTER_ADDRESS } from './constants'

export const getOwnableExecuter = ({
  owner,
  hook,
}: {
  owner: Address
  hook?: Address
}): Module => {
  return {
    module: OWNABLE_EXECUTER_ADDRESS,
    data: encodePacked(['address'], [owner]),
    deInitData: '0x',
    additionalContext: '0x',
    type: 'executor',
    hook,
  }
}
