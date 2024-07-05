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
    module: OWNABLE_VALIDATOR_ADDRESS,
    data: encodeAbiParameters(
      [
        { name: 'threshold', type: 'uint256' },
        { name: 'owners', type: 'address[]' },
      ],
      [BigInt(threshold), owners],
    ),
    deInitData: '0x',
    additionalContext: '0x',
    hook,
    type: 'validator',
  }
}
