import { Address, encodeAbiParameters, encodePacked } from 'viem'
import { Module } from '../types'
import { MULTI_FACTOR_VALIDATOR_ADDRESS } from './constants'
import { Validator } from './types'

export const getMultiFactorValidator = ({
  threshold,
  validators,
  hook,
}: {
  threshold: number
  validators: Validator[]
  hook?: Address
}): Module => {
  return {
    address: MULTI_FACTOR_VALIDATOR_ADDRESS,
    module: MULTI_FACTOR_VALIDATOR_ADDRESS,
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
