import { Account } from '../../types'
import { Hex, PublicClient, encodePacked } from 'viem'
import { KernelModule } from '../types'

export const encodeModuleUninstallationData = async ({
  client,
  account,
  module,
}: {
  client: PublicClient
  account: Account
  module: KernelModule
}): Promise<Hex> => {
  switch (module.type) {
    case 'validator':
    case 'executor':
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
