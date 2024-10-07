import { Address, encodeAbiParameters } from 'viem'
import { Module } from '../types'
import { OWNABLE_VALIDATOR_ADDRESS } from './constants'

export const getOwnableValidator = ({
  threshold,
  owners,
  hook,
}: {
  threshold: number
  owners: Address[]
  hook?: Address
}): Module => {
  return {
    address: OWNABLE_VALIDATOR_ADDRESS,
    module: OWNABLE_VALIDATOR_ADDRESS,
    initData: encodeAbiParameters(
      [
        { name: 'threshold', type: 'uint256' },
        { name: 'owners', type: 'address[]' },
      ],
      [BigInt(threshold), owners.sort()],
    ),
    deInitData: '0x',
    additionalContext: '0x',
    hook,
    type: 'validator',
  }
}
