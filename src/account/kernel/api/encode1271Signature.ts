import { ERC1271SignatureParams } from '../../types'
import { encodePacked, Hex } from 'viem'

export const encode1271Signature = ({
  account,
  validator,
  signature,
}: ERC1271SignatureParams): Hex => {
  return encodePacked(
    ['bytes1', 'address', 'bytes'],
    ['0x01', validator, signature],
  )
}
