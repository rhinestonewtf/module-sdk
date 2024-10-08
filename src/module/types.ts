import { SafeHookType } from '../account/safe/types'
import { Address, Hex } from 'viem'

export type ModuleType = 'validator' | 'executor' | 'fallback' | 'hook'

export type Module = {
  address: Address
  // note: this parameter will be deprecated in the next major version; use address instead
  module: Address
  initData: Hex
  deInitData: Hex
  additionalContext: Hex
  type: ModuleType

  /* ---- kernel module params ---- */
  // these param needed for installing validator, executor, fallback handler
  hook?: Address
  /* ---- end kernel module params ---- */

  /* ---- safe module params ---- */

  // these two params needed for installing hooks
  hookType?: SafeHookType
  selector?: Hex

  /* ---- safe and nexus module params ---- */

  // these two params needed for installing fallback handlers
  functionSig?: Hex
  callType?: CallType

  /* ---- end safe module params ---- */
}

type ModuleTypeIds = {
  [index in ModuleType]: 1 | 2 | 3 | 4
}

export const moduleTypeIds: ModuleTypeIds = {
  validator: 1,
  executor: 2,
  fallback: 3,
  hook: 4,
}

export enum CallType {
  CALLTYPE_SINGLE = '0x00',
  CALLTYPE_BATCH = '0x01',
  CALLTYPE_STATIC = '0xFE',
  CALLTYPE_DELEGATECALL = '0xFF',
}

export type {
  ERC20Token,
  Order,
  RecurringOrder,
  Schedule,
} from './scheduled-orders'

export type { SigHookInit } from './hook-multi-plexer'

export type { Validator } from './multi-factor-validator'
