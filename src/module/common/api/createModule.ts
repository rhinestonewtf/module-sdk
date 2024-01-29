import { Address, Hex } from 'viem'
import { Module, ModuleType } from '../Module'

export const createModule = ({
  address,
  initData,
  type,
}: {
  address: Address
  initData: Hex
  type: ModuleType
}): Module => {
  return {
    address,
    initData,
    type,
  }
}
