import { Account } from '../../types'
import { Hex, encodeAbiParameters, parseAbiParameters } from 'viem'
import { Module } from '../../../module/types'

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
        [module.hookType!, module.selector!, module.initData || '0x'],
      )
    case 'fallback':
      return encodeAbiParameters(
        parseAbiParameters(
          'bytes4 functionSig, bytes1 calltype, bytes memory initData',
        ),
        [module.functionSig!, module.callType!, module.initData || '0x'],
      )
    default:
      throw new Error(`Unknown module type ${module.type}`)
  }
}
