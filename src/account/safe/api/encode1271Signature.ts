import { ERC1271SignatureParams } from '../../types'
import { concat, encodePacked, fromHex, Hex, slice, toHex } from 'viem'

export const encode1271Signature = ({
  account,
  validator,
  signature,
}: ERC1271SignatureParams): Hex => {
  let formattedSignature = signature
  if (account == validator) {
    const v = fromHex(slice(signature, 64, 65), 'number')
    if (v < 30) {
      formattedSignature = concat([slice(signature, 0, 64), toHex(v + 4)])
    }
  }
  return encodePacked(['address', 'bytes'], [validator, formattedSignature])
}
