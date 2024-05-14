import { Address, Hex } from 'viem'
import { Module, ModuleType } from '../types'
import { SafeCallType, SafeHookType } from 'src/account/safe/types'

export const getModule = ({
  module,
  data,
  type,
  additionalContext,
  hook,
  functionSig,
  callType,
  selector,
  hookType,
}: {
  module: Address
  data?: Hex
  type: ModuleType
  additionalContext?: Hex
  // kernel props
  hook?: Address

  /* ---  safe props  ---- */
  // these two params needed for installing fallback handler
  functionSig?: Hex
  callType?: SafeCallType

  // these two params needed for installing hooks
  selector?: Hex
  hookType?: SafeHookType
}): Module => {
  return {
    module,
    data,
    type,
    additionalContext: additionalContext || '0x',
    hook,
    functionSig,
    callType,
    selector,
    hookType,
  }
}
