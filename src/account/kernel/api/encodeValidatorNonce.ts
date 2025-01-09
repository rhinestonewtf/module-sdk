import { pad, encodePacked, Address } from 'viem'
import { KernelModule } from '../types'
import { isKernelModule } from './utils'

export const encodeValidatorNonce = ({
  validator,
}: {
  validator: KernelModule | Address
}) => {
  return BigInt(
    pad(
      encodePacked(
        ['bytes1', 'bytes1', 'address'],
        [
          '0x00',
          '0x00',
          isKernelModule(validator) ? validator.address : validator,
        ],
      ),
      {
        dir: 'right',
        size: 24,
      },
    ),
  )
}
