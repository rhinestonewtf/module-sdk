import { Address, Hex, encodeAbiParameters } from 'viem'
import { Module } from '../types'
import { MFA_VALIDATOR_ADDRESS } from './constants'

export const getMFAValidator = ({
  validators,
  threshold,
}: {
  validators: Module[]
  threshold: number
}): Module => {
  const deInitDatas: Hex[] = [...Array(validators.length).fill('0x')]

  const subValidators: Address[] = validators.map(
    (validator) => validator.module,
  )
  const initDatas: Hex[] = validators.map((validator) => validator.data ?? '0x')

  return {
    module: MFA_VALIDATOR_ADDRESS,
    data: encodeAbiParameters(
      [
        { name: 'subValidators', type: 'address[]' },
        { name: 'deInitDatas', type: 'bytes[]' },
        { name: 'initDatas', type: 'bytes[]' },
        { name: 'threshold', type: 'uint8' },
      ],
      [subValidators, deInitDatas, initDatas, threshold],
    ),
    deInitData: '0x',
    additionalContext: '0x',
    type: 'validator',
  }
}
