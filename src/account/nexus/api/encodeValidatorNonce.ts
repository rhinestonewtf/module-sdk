import { Address, pad } from 'viem'
import { Module } from '../../../module/types'
import { isModule } from '../../../account/utils'

export const encodeValidatorNonce = ({
  validator,
}: {
  validator: Module | Address
}) => {
  return BigInt(
    pad(isModule(validator) ? validator.address : validator, {
      dir: 'right',
      size: 24,
    }),
  )
}
