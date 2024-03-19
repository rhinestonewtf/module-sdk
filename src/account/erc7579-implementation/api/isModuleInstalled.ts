import { PublicClient, getAddress } from 'viem'
import { Account } from '../../types'
import AccountInterface from '../constants/abis/ERC7579Implementation.json'
import { Module, moduleTypeIds } from '../../../module/types'
import { isContract } from '../../../common/utils'
import { getInitData } from './getInitData'

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
    case 'fallback':
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
  let isModuleInstalled = false

  if (await isContract({ client, address: account.address })) {
    isModuleInstalled = (await client.readContract({
      address: account.address,
      abi: AccountInterface.abi,
      functionName: 'isModuleInstalled',
      args: [
        moduleTypeIds[module.type],
        module.module,
        module.additionalContext,
      ],
    })) as boolean
  } else if (account.initCode) {
    const initialModules = getInitData({ initCode: account.initCode })
    switch (module.type) {
      case 'validator':
        isModuleInstalled = initialModules.validators.some(
          (_module: Module) =>
            getAddress(_module.module) == getAddress(module.module),
        )
        break
      case 'executor':
        isModuleInstalled = initialModules.executors.some(
          (_module: Module) =>
            _module.module.toLowerCase() == module.module.toLowerCase(),
        )
        break
      case 'hook':
        isModuleInstalled = initialModules.hooks.some(
          (_module: Module) =>
            _module.module.toLowerCase() == module.module.toLowerCase(),
        )
        break
      case 'fallback':
        isModuleInstalled = initialModules.fallbacks.some(
          (_module: Module) =>
            _module.module.toLowerCase() == module.module.toLowerCase(),
        )
        break
    }
  } else {
    throw new Error('Account has no init code and is not deployed')
  }
  return isModuleInstalled
}
