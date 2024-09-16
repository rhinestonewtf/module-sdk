import { ERC1271HashParams } from '../../types'
import { Hex } from 'viem'

export const encode1271Hash = ({
  account,
  chainId,
  validator,
  hash,
}: ERC1271HashParams): Hex => {
  return hash
}
