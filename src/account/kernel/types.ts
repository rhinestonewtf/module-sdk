import { Address, Hex } from 'viem'

export type KernelModule = {
  module: Address
  data?: Hex
  additionalContext?: Hex
  type: KernelModuleType
}

export type KernelModuleType =
  | 'validator'
  | 'executor'
  | 'fallback'
  | 'hook'
  | 'policy'
  | 'signer'

type ModuleTypeIds = {
  [index in KernelModuleType]: number
}

export const kernelModuleTypeIds: ModuleTypeIds = {
  validator: 1,
  executor: 2,
  fallback: 3,
  hook: 4,
  policy: 5,
  signer: 6,
}
