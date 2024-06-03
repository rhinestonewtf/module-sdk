import { Address, encodeAbiParameters } from 'viem'
import { Module } from '../types'
import { SOCIAL_RECOVERY_ADDRESS } from './constants'

export const getInstallSocialRecovery = ({
  threshold,
  guardians,
  hook,
}: {
  threshold: number
  guardians: Address[]
  hook?: Address
}): Module => {
  return {
    module: SOCIAL_RECOVERY_ADDRESS,
    data: encodeAbiParameters(
      [
        { name: 'threshold', type: 'uint256' },
        { name: 'guardians', type: 'address[]' },
      ],
      [BigInt(threshold), guardians],
    ),
    additionalContext: '0x',
    type: 'validator',
    hook,
  }
}
