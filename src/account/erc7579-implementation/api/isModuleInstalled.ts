import { Address, Hex, PublicClient } from 'viem'
import { Account } from '../../common/Account'
import AccountInterface from '../constants/abis/ERC7579Implementation.json'
import { Module, moduleTypeIds } from '../../../module/common/Module'
import { isContract } from '../../../common/utils'
import { FALLBACK_HANDLER } from '../constants/contracts'
import { getInitData } from './getInitData'

export const isModuleInstalled = ({
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
      return _isModuleInstalled({ client, account, module })
    case 'fallback':
      return _isFallbackInstalled({
        client,
        account,
        module,
      })
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
        module.address,
        module.additionalContext,
      ],
    })) as boolean
  } else if (account.initCode) {
    const initialModules = getInitData({ initCode: account.initCode })
    switch (module.type) {
      case 'validator':
        isModuleInstalled = initialModules.validators.some(
          (_module: Module) =>
            _module.address.toLowerCase() == module.address.toLowerCase(),
        )
      case 'executor':
        isModuleInstalled = initialModules.executors.some(
          (_module: Module) =>
            _module.address.toLowerCase() == module.address.toLowerCase(),
        )
      case 'hook':
        isModuleInstalled = initialModules.hooks.some(
          (_module: Module) =>
            _module.address.toLowerCase() == module.address.toLowerCase(),
        )
    }
  } else {
    throw new Error('Account has no init code and is not deployed')
  }
  return isModuleInstalled
}

const _isFallbackInstalled = async ({
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
        FALLBACK_HANDLER,
        module.additionalContext,
      ],
    })) as boolean
  } else if (account.initCode) {
    const { fallbacks } = getInitData({ initCode: account.initCode })
    isModuleInstalled = fallbacks.some(
      (fallback: Module) =>
        fallback.address.toLowerCase() == module.address.toLowerCase(),
    )
  } else {
    throw new Error('Account has no init code and is not deployed')
  }
  return isModuleInstalled
}
