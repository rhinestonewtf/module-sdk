import { CallType } from '../../module/types'
import { Address, Hex } from 'viem'

export type KernelModule = {
  address: Address
  module: Address
  initData: Hex
  deInitData: Hex
  additionalContext: Hex
  type: KernelModuleType
  hook?: Address
  selector?: Hex
  callType?: CallType
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
