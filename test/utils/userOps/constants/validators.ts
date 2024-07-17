import { Hex } from 'viem'
import { ValidatorList } from '../types'
import { privateKeyToAccount } from 'viem/accounts'

export const validators: ValidatorList = {
  ecdsa: {
    name: 'ecdsa',
    address: '0xf83d07238a7c8814a48535035602123ad6dbfa63',
    mockSignature:
      '0xe8b94748580ca0b4993c9a1b86b5be851bfc076ff5ce3a1ff65bf16392acfcb800f9b4f1aef1555c7fce5599fffb17e7c635502154a0333ba21f3ae491839af51c',
    signMessageAsync: async (message: Hex) => {
      const account = privateKeyToAccount(process.env.PRIVATE_KEY as Hex)
      return account.signMessage({
        message,
      })
    },
  },
  mock: {
    name: 'mock',
    address: '0x503b54Ed1E62365F0c9e4caF1479623b08acbe77',
    mockSignature:
      '0xe8b94748580ca0b4993c9a1b86b5be851bfc076ff5ce3a1ff65bf16392acfcb800f9b4f1aef1555c7fce5599fffb17e7c635502154a0333ba21f3ae491839af51c',
    signMessageAsync: async () => {
      return '0xe8b94748580ca0b4993c9a1b86b5be851bfc076ff5ce3a1ff65bf16392acfcb800f9b4f1aef1555c7fce5599fffb17e7c635502154a0333ba21f3ae491839af51c' as Hex
    },
  },
}

export const defaultValidator = validators.mock
