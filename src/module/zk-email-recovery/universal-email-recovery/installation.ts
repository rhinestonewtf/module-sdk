import { Address, encodeAbiParameters, Hex } from 'viem'
import { Module } from '../../types'
import { getModuleAddress } from './constants'

export const getUniversalEmailRecoveryExecutor = ({
  validator,
  isInstalledContext,
  initialSelector,
  guardians,
  weights,
  threshold,
  delay,
  expiry,
  chainId,
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
  chainId: number
  hook?: Address
}): Module => {
  return {
    address: getModuleAddress(chainId),
    module: getModuleAddress(chainId),
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
