import { Address, encodeAbiParameters, encodePacked } from 'viem'
import { Module } from '../types'
import { MULTI_FACTOR_VALIDATOR_ADDRESS } from './constants'
import { Validator } from './types'

export const getInstallMultiFactorValidator = ({
  threshold,
  validators,
  hook,
}: {
  threshold: number
  validators: Validator[]
  hook?: Address
}): Module => {
  return {
    module: MULTI_FACTOR_VALIDATOR_ADDRESS,
    data: encodePacked(
      ['uint8', 'bytes'],
      [
        threshold,
        encodeAbiParameters(
          [
            {
              components: [
                {
                  internalType: 'bytes',
                  name: 'packedValidatorAndId',
                  type: 'bytes',
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
    additionalContext: '0x',
    type: 'validator',
    hook,
  }
}
