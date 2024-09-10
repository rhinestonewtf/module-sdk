import { Signature1271Params } from '../../types'
import { encodePacked, Hex } from 'viem'

export const encode1271Signature = ({
  validator,
  signature,
}: Signature1271Params): Hex => {
  return encodePacked(
    ['bytes1', 'address', 'bytes'],
    ['0x01', validator, signature],
  )
}
