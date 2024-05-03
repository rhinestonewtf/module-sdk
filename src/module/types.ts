import { Address, Hex } from 'viem'

export type ModuleType = 'validator' | 'executor' | 'fallback' | 'hook'

export type Module = {
  module: Address
  data?: Hex
  additionalContext?: Hex
  type: ModuleType
  hook?: Address
}

type ModuleTypeIds = {
  [index in ModuleType]: number
}

export const moduleTypeIds: ModuleTypeIds = {
  validator: 1,
  executor: 2,
  fallback: 3,
  hook: 4,
}
