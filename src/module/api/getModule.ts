import { Address, Hex } from 'viem'
import { Module, ModuleType } from '../Module'

export const getModule = ({
  module,
  data,
  type,
  additionalContext,
}: {
  module: Address
  data?: Hex
  type: ModuleType
  additionalContext?: Hex
}): Module => {
  return {
    module,
    data,
    type,
    additionalContext: additionalContext || '0x',
  }
}
