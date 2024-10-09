import { Account } from '../../types'
import {
  Hex,
  PublicClient,
  parseAbiParameters,
  encodeAbiParameters,
} from 'viem'
import { Module } from '../../../module/types'
import { getPreviousModule } from '../../../common'
import { SafeHookType } from '../types'

export const encodeModuleUninstallationData = async ({
  client,
  account,
  module,
}: {
  client: PublicClient
  account: Account
  module: Module
}): Promise<Hex> => {
  switch (module.type) {
    case 'validator':
    case 'executor':
      const prev = await getPreviousModule({ client, account, module })
      return encodeAbiParameters(
        [
          { name: 'prev', type: 'address' },
          { name: 'disableModuleData', type: 'bytes' },
        ],
        [prev, module.deInitData],
      )
    case 'hook':
      return encodeAbiParameters(
        parseAbiParameters(
          'uint8 hookType, bytes4 selector, bytes memory deInitData',
        ),
        [
          module.hookType ?? SafeHookType.GLOBAL,
          module.hookType == SafeHookType.SIG ? module.selector! : '0x00000000',
          module.deInitData,
        ],
      )

    case 'fallback':
      return encodeAbiParameters(
        parseAbiParameters('bytes4 functionSig, bytes memory moduleDeInitData'),
        [module.functionSig!, module.deInitData],
      )
    default:
      throw new Error(`Unknown module type ${module.type}`)
  }
}
