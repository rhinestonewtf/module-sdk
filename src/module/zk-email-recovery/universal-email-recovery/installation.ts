import { Address, encodeAbiParameters, Hex } from 'viem'
import { Module } from '../../types'
import { UNIVERSAL_EMAIL_RECOVERY_ADDRESS } from './constants'

export const getUniversalEmailRecoveryExecutor = ({
  validator,
  isInstalledContext,
  initialSelector,
  guardians,
  weights,
  threshold,
  delay,
  expiry,
  hook,
}: {
  validator: Address
  isInstalledContext: Hex
  initialSelector: Hex
  guardians: Array<Address>
  weights: Array<bigint>
  threshold: bigint
  delay: bigint
  expiry: bigint
  hook?: Address
}): Module => {
  return {
    address: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    module: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    initData: encodeAbiParameters(
      [
        { name: 'validator', type: 'address' },
        { name: 'isInstalledContext', type: 'bytes' },
        { name: 'initialSelector', type: 'bytes4' },
        { name: 'guardians', type: 'address[]' },
        { name: 'weights', type: 'uint256[]' },
        { name: 'delay', type: 'uint256' },
        { name: 'expiry', type: 'uint256' },
        { name: 'threshold', type: 'uint256' },
      ],
      [
        validator,
        isInstalledContext,
        initialSelector,
        guardians,
        weights.map((weight) => BigInt(weight)),
        BigInt(threshold),
        BigInt(delay),
        BigInt(expiry),
      ],
    ),
    deInitData: '0x',
    additionalContext: '0x',
    type: 'executor',
    hook,
  }
}