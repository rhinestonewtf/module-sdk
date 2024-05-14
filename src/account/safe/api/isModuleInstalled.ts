import {
  Hex,
  PublicClient,
  encodeAbiParameters,
  parseAbi,
  parseAbiParameters,
} from 'viem'
import { Account } from '../../types'
import { isContract } from '../../../common/utils'
import { accountAbi } from '../constants/abis'
import { moduleTypeIds } from '../../../module/types'
import { Module } from '../../../module/types'

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
      return await _isModuleInstalled({ client, account, module })
    case 'hook':
      if (!module.selector || module.hookType === undefined) {
        throw new Error(
          `hookType and selector params are required for module type ${module.type}`,
        )
      }
      return await _isModuleInstalled({ client, account, module })
    case 'fallback':
      if (!module.functionSig) {
        throw new Error(
          `functionSig param is required for module type ${module.type}`,
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
  if (await isContract({ client, address: account.address })) {
    return (await client.readContract({
      address: account.address,
      abi: parseAbi(accountAbi),
      functionName: 'isModuleInstalled',
      args: [
        moduleTypeIds[module.type],
        module.module,
        getModuleAdditionalContext(module),
      ],
    })) as boolean
  }

  return false
}

const getModuleAdditionalContext = (module: Module): Hex => {
  switch (module.type) {
    case 'validator':
    case 'executor':
      return '0x'
    case 'hook':
      return encodeAbiParameters(
        parseAbiParameters('uint8 hookType, bytes4 selector'),
        [module.hookType!, module.selector!],
      )
    case 'fallback':
      return encodeAbiParameters(parseAbiParameters('bytes4 functionSig'), [
        module.functionSig!,
      ])
    default:
      throw new Error(`Unknown module type ${module.type}`)
  }
}
