import { ERC1271SignatureParams } from '../../types'
import { encodePacked, Hex } from 'viem'

export const encode1271Signature = ({
  account,
  validator,
  signature,
}: ERC1271SignatureParams): Hex => {
  return encodePacked(['address', 'bytes'], [validator, signature])
}
