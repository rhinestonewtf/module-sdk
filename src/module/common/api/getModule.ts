import { Address, Hex } from 'viem'
import { Module, ModuleType } from '../Module'

export const getModule = ({
  address,
  initData,
  type,
  additionalContext,
}: {
  address: Address
  initData: Hex
  type: ModuleType
  additionalContext?: Hex
}): Module => {
  return {
    address,
    initData,
    type,
    additionalContext,
  }
}
