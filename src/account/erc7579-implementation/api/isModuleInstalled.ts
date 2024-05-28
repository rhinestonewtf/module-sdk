import { PublicClient, encodeAbiParameters, parseAbi } from 'viem'
import { Account } from '../../types'
import { Module, moduleTypeIds } from '../../../module/types'
import { isContract } from '../../../common/utils'
import { accountAbi } from '../constants/abis'

export const isModuleInstalled = async ({
  client,
  account,
  module,
}: {
  client: PublicClient
  account: Account
  module: Module
}): Promise<boolean> => {
  switch (module.type) {
    case 'validator':
    case 'executor':
    case 'hook':
      return await _isModuleInstalled({ client, account, module })
    case 'fallback':
      if (!module.selector) {
        throw new Error(
          `Selector param is required for module type ${module.type}`,
        )
      }
      return await _isModuleInstalled({ client, account, module })
    default:
      throw new Error(`Unknown module type ${module.type}`)
  }
}

const _isModuleInstalled = async ({
  client,
  account,
  module,
}: {
  client: PublicClient
  account: Account
  module: Module
}): Promise<boolean> => {
  try {
    if (await isContract({ client, address: account.address })) {
      return (await client.readContract({
        address: account.address,
        abi: parseAbi(accountAbi),
        functionName: 'isModuleInstalled',
        args: [
          moduleTypeIds[module.type],
          module.module,
          module.selector
            ? encodeAbiParameters(
                [{ name: 'functionSignature', type: 'bytes4' }],
                [module.selector],
              )
            : '0x',
        ],
      })) as boolean
    }
    return false
  } catch (e) {
    return false
  }
}
