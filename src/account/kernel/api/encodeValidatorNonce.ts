import { pad, encodePacked } from 'viem'
import { KernelModule } from '../types'

export const encodeValidatorNonce = ({
  validator,
}: {
  validator: KernelModule
}) => {
  return BigInt(
    pad(
      encodePacked(
        ['bytes1', 'bytes1', 'address'],
        ['0x00', '0x00', validator.address],
      ),
      {
        dir: 'right',
        size: 24,
      },
    ),
  )
}
