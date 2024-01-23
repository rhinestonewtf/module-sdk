import { Address, Hex } from 'viem'
import { Account } from '../Account'

export const createAccount = (address: Address, initCode: Hex): Account => {
  return {
    address,
    initCode,
  }
}
