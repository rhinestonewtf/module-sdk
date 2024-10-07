import { Address, encodeAbiParameters } from 'viem'
import { Module } from '../types'
import { SOCIAL_RECOVERY_ADDRESS } from './constants'

export const getSocialRecoveryValidator = ({
  threshold,
  guardians,
  hook,
}: {
  threshold: number
  guardians: Address[]
  hook?: Address
}): Module => {
  return {
    address: SOCIAL_RECOVERY_ADDRESS,
    module: SOCIAL_RECOVERY_ADDRESS,
    initData: encodeAbiParameters(
      [
        { name: 'threshold', type: 'uint256' },
        { name: 'guardians', type: 'address[]' },
      ],
      [BigInt(threshold), guardians.sort()],
    ),
    deInitData: '0x',
    additionalContext: '0x',
    type: 'validator',
    hook,
  }
}
