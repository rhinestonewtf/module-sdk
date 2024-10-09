import { Account } from '../../types'
import { Hex, encodeAbiParameters, parseAbiParameters } from 'viem'
import { CallType, Module } from '../../../module/types'
import { SafeHookType } from '../types'

export const encodeModuleInstallationData = ({
  account,
  module,
}: {
  account: Account
  module: Module
}): Hex => {
  switch (module.type) {
    case 'validator':
    case 'executor':
      return module.initData
    case 'hook':
      return encodeAbiParameters(
        parseAbiParameters(
          'uint8 hookType, bytes4 selector, bytes memory initData',
        ),
        [
          module.hookType ?? SafeHookType.GLOBAL,
          module.hookType == SafeHookType.SIG ? module.selector! : '0x00000000',
          module.initData,
        ],
      )
    case 'fallback':
      return encodeAbiParameters(
        parseAbiParameters(
          'bytes4 functionSig, bytes1 calltype, bytes memory initData',
        ),
        [
          module.functionSig!,
          module.callType ?? CallType.CALLTYPE_SINGLE,
          module.initData,
        ],
      )
    default:
      throw new Error(`Unknown module type ${module.type}`)
  }
}
