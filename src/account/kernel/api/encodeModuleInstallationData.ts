import { Account } from '../../types'
import { Hex, encodePacked, encodeAbiParameters, zeroAddress } from 'viem'
import { KernelModule } from '../types'

export const encodeModuleInstallationData = ({
  account,
  module,
}: {
  account: Account
  module: KernelModule
}): Hex => {
  switch (module.type) {
    case 'validator':
    case 'executor':
      return encodePacked(
        ['address', 'bytes'],
        [
          module.hook ?? zeroAddress,
          encodeAbiParameters(
            [{ type: 'bytes' }, { type: 'bytes' }],
            [module.initData, '0x'],
          ),
        ],
      )
    case 'hook':
      return module.initData
    case 'fallback':
      return encodePacked(
        ['bytes4', 'address', 'bytes'],
        [
          module.selector!,
          module.hook ?? zeroAddress,
          encodeAbiParameters(
            [{ type: 'bytes' }, { type: 'bytes' }],
            [
              encodePacked(
                ['bytes1', 'bytes'],
                [module.callType!, module.initData],
              ),
              '0x',
            ],
          ),
        ],
      )
    default:
      throw new Error(`Unknown module type ${module.type}`)
  }
}
