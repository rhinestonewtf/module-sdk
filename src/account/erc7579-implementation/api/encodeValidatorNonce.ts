import { pad } from 'viem'
import { Module } from '../../../module/types'

export const encodeValidatorNonce = ({ validator }: { validator: Module }) => {
  return BigInt(
    pad(validator.address, {
      dir: 'right',
      size: 24,
    }),
  )
}
