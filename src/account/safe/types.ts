import { ModuleType } from 'src/module'
import { Address, Hex } from 'viem'

export type SafeModule = {
  module: Address
  data?: Hex
  additionalContext?: Hex
  type: ModuleType

  // these two params needed for installing hooks
  hookType?: SafeHookType
  selector?: Hex

  // these two params needed for installing fallback handlers
  functionSig?: Hex
  callType?: SafeCallType
}

export enum SafeHookType {
  GLOBAL = 0,
  SIG = 1,
}

export enum SafeCallType {
  CALLTYPE_SINGLE = '0x00',
  CALLTYPE_BATCH = '0x01',
}
