import { Address, encodeAbiParameters, encodePacked } from 'viem'
import { Module } from '../types'
import { Validator } from './types'
import { GLOBAL_CONSTANTS } from '../../constants'

export const getMultiFactorValidator = ({
  threshold,
  validators,
  hook,
  address = GLOBAL_CONSTANTS.MULTI_FACTOR_VALIDATOR_ADDRESS,
}: {
  threshold: number
  validators: Validator[]
  hook?: Address
  // Defaults to the registry-bound MultiFactor. Pass
  // MULTI_FACTOR_VALIDATOR_V2_ADDRESS for the registry-free module.
  address?: Address
}): Module => {
  return {
    address,
    module: address,
    initData: encodePacked(
      ['uint8', 'bytes'],
      [
        threshold,
        encodeAbiParameters(
          [
            {
              components: [
                {
                  internalType: 'bytes32',
                  name: 'packedValidatorAndId',
                  type: 'bytes32',
                },
                { internalType: 'bytes', name: 'data', type: 'bytes' },
              ],
              name: 'validators',
              type: 'tuple[]',
            },
          ],
          [validators],
        ),
      ],
    ),
    deInitData: '0x',
    additionalContext: '0x',
    type: 'validator',
    hook,
  }
}
