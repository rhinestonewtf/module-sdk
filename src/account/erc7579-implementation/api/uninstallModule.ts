import { Address, Hex, PublicClient, encodeFunctionData } from 'viem'
import { Account, Action } from '../../Account'
import { Module, moduleTypeIds } from '../../../Module/Module'
import { isModuleInstalled } from './isModuleInstalled'
import AccountInterface from '../constants/abis/ERC7579Implementation.json'
import { FALLBACK_HANDLER } from '../constants/contracts'

export const uninstallModule = ({
  client,
  account,
  module,
}: {
  client: PublicClient
  account: Account
  module: Module
}): Promise<Action[]> => {
  switch (module.type) {
    case 'validator':
    case 'executor':
    case 'hook':
      return _uninstallModule({ client, account, module })
    case 'fallback':
      return _uninstallFallback({ client, account, module })
    default:
      throw new Error(`Unknown module type ${module.type}`)
  }
}

const _uninstallModule = async ({
  client,
  account,
  module,
}: {
  client: PublicClient
  account: Account
  module: Module
}) => {
  const actions: Action[] = []
  const isInstalled = await isModuleInstalled({ client, account, module })

  if (isInstalled) {
    actions.push({
      target: account.address,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: 'uninstallModule',
        abi: AccountInterface.abi,
        args: [moduleTypeIds[module.type], module.address, module.data || '0x'],
      }),
    })
  }
  return actions
}

const _uninstallFallback = async ({
  client,
  account,
  module,
}: {
  client: PublicClient
  account: Account
  module: Module
}) => {
  const actions: Action[] = []

  const isHandlerInstalled = await isModuleInstalled({
    client,
    account,
    module: {
      type: 'fallback',
      address: FALLBACK_HANDLER,
    },
  })

  if (isHandlerInstalled) {
    // todo: finalise fallback handler
    // actions.push({
    //   target: account.address,
    //   value: BigInt(0),
    //   callData: encodeFunctionData({
    //     functionName: 'installModule',
    //     abi: AccountInterface.abi,
    //     args: [moduleTypeIds['fallback'], FALLBACK_HANDLER, '0x'],
    //   }),
    // })
  }

  return actions
}
