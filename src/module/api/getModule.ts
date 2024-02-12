import { Address, Hex } from 'viem'
import { Module, ModuleType } from '../Module'

export const getModule = ({
  address,
  data,
  type,
  additionalContext,
}: {
  address: Address
  data?: Hex
  type: ModuleType
  additionalContext?: Hex
}): Module => {
  return {
    address,
    data,
    type,
    additionalContext,
  }
}
