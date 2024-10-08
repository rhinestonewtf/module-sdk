import { Account } from '../../types'
import { Hex, PublicClient, encodePacked, encodeAbiParameters } from 'viem'
import { Module, CallType } from '../../../module/types'
import { getPreviousModule } from '../../../common'

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
      return module.deInitData
    case 'fallback':
      return encodePacked(
        ['bytes4', 'bytes'],
        [module.selector!, module.deInitData],
      )
    default:
      throw new Error(`Unknown module type ${module.type}`)
  }
}
