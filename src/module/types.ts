import { SafeCallType, SafeHookType } from '../account/safe/types'
import { Address, Hex } from 'viem'

export type ModuleType = 'validator' | 'executor' | 'fallback' | 'hook'

export type Module = {
  module: Address
  data?: Hex
  additionalContext?: Hex
  type: ModuleType

  /* ---- kernel module params ---- */
  // these param needed for installing validator, executor, fallback handler
  hook?: Address
  /* ---- end kernel module params ---- */

  /* ---- safe module params ---- */

  // these two params needed for installing hooks
  hookType?: SafeHookType
  selector?: Hex

  // these two params needed for installing fallback handlers
  functionSig?: Hex
  callType?: SafeCallType

  /* ---- end safe module params ---- */
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
