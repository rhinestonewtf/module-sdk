import { Address, encodeAbiParameters } from 'viem'
import { Module } from '../types'
import { OWNABLE_VALIDATOR_ADDRESS } from './constants'

export const getInstallOwnableValidator = ({
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
    additionalContext: '0x',
    hook,
    type: 'validator',
  }
}
