import { Address, Hex } from 'viem'
import { Module, ModuleType } from '../types'

export const getModule = ({
  module,
  data,
  type,
  additionalContext,
  hook,
}: {
  module: Address
  data?: Hex
  type: ModuleType
  additionalContext?: Hex
  hook?: Address
}): Module => {
  return {
    module,
    data,
    type,
    additionalContext: additionalContext || '0x',
    hook,
  }
}
