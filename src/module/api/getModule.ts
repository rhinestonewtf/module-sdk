import { Address, Hex } from 'viem'
import { CallType, Module, ModuleType } from '../types'
import { SafeHookType } from '../../account/safe/types'

export const getModule = ({
  address,
  module,
  initData = '0x',
  deInitData = '0x',
  type,
  additionalContext,
  hook,
  functionSig,
  callType,
  selector,
  hookType,
}: {
  address?: Address
  module: Address
  initData?: Hex
  deInitData?: Hex
  type: ModuleType
  additionalContext?: Hex

  // kernel props
  hook?: Address

  /* ---  safe props  ---- */
  // these two params needed for installing fallback handler
  functionSig?: Hex
  callType?: CallType

  // these two params needed for installing hooks
  selector?: Hex
  hookType?: SafeHookType
}): Module => {
  return {
    address: address ?? module,
    module,
    initData,
    deInitData,
    type,
    additionalContext: additionalContext || '0x',
    hook,
    functionSig,
    callType,
    selector,
    hookType,
  }
}
