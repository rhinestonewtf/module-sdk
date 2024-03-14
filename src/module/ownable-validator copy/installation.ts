import { Address, encodeAbiParameters } from 'viem'
import { Module } from '../types'
import { OWNABLE_VALIDATOR_ADDRESS } from './constants'

export const getOwnableValidator = ({
  ownerAddress,
}: {
  ownerAddress: Address
}): Module => {
  return {
    module: OWNABLE_VALIDATOR_ADDRESS,
    data: encodeAbiParameters(
      [{ name: 'owner', type: 'address' }],
      [ownerAddress],
    ),
    additionalContext: '0x',
    type: 'validator',
  }
}
