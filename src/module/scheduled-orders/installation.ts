import { Address, Hex, encodeAbiParameters } from 'viem'
import { Module } from '../Module'
import { SCHEDULED_ORDERS_VALIDATOR_ADDRESS } from './constants'

export type WebauthnCredential = {
  id: string
  publicKey: [Hex, Hex]
}

export const getScheduledOrdersExecutor = ({
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
    module: SCHEDULED_ORDERS_VALIDATOR_ADDRESS,
    data: encodeAbiParameters(
      [
        { name: 'subValidators', type: 'address[]' },
        { name: 'deInitDatas', type: 'bytes[]' },
        { name: 'initDatas', type: 'bytes[]' },
        { name: 'threshold', type: 'uint8' },
      ],
      [subValidators, deInitDatas, initDatas, threshold],
    ),
    additionalContext: '0x',
    type: 'validator',
  }
}
