import { Account } from '../../types'
import { Hex, encodePacked } from 'viem'
import { Module, CallType } from '../../../module/types'

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
    case 'hook':
      return module.initData
    case 'fallback':
      return encodePacked(
        ['bytes4', 'bytes1', 'bytes'],
        [
          module.selector!,
          module.callType ?? CallType.CALLTYPE_SINGLE,
          module.initData,
        ],
      )
    default:
      throw new Error(`Unknown module type ${module.type}`)
  }
}
