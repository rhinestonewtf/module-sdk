import { ERC1271HashParams } from '../../types'
import { hashTypedData, Hex } from 'viem'

export const encode1271Hash = ({
  account,
  chainId,
  validator,
  hash,
}: ERC1271HashParams): Hex => {
  if (validator == account) {
    return hashTypedData({
      domain: {
        chainId: chainId,
        verifyingContract: account,
      },
      types: {
        SafeMessage: [{ name: 'message', type: 'bytes' }],
      },
      primaryType: 'SafeMessage',
      message: {
        message: hash,
      },
    })
  }
  return hash
}
