import { Account, Action } from '../../common/Account'
import { Address, Hex, PublicClient, encodeFunctionData } from 'viem'
import AccountInterface from '../constants/abis/ERC7579Implementation.json'
import ExtensibleFallbackHandler from '../constants/abis/ExtensibleFallbackHandler.json'
import { isModuleInstalled } from './isModuleInstalled'
import { Module, moduleTypeIds } from '../../../module/common/Module'
import { FALLBACK_HANDLER } from '../constants/contracts'

export const installModule = ({
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
      return _installModule({ client, account, module })
    case 'fallback':
      return installFallback({ client, account, module })
    default:
      throw new Error(`Unknown module type ${module.type}`)
  }
}

const _installModule = async ({
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

  if (!isInstalled) {
    actions.push({
      target: account.address,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: 'installModule',
        abi: AccountInterface.abi,
        args: [moduleTypeIds[module.type], module.address, module.data || '0x'],
      }),
    })
  }
  return actions
}

async function installFallback({
  client,
  account,
  module,
}: {
  client: PublicClient
  account: Account
  module: Module
}): Promise<Action[]> {
  const actions: Action[] = []

  const isHandlerInstalled = await isModuleInstalled({
    client,
    account,
    module: {
      type: 'fallback',
      address: FALLBACK_HANDLER,
    },
  })

  if (!isHandlerInstalled) {
    actions.push({
      target: account.address,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: 'installModule',
        abi: AccountInterface.abi,
        args: [moduleTypeIds['fallback'], FALLBACK_HANDLER, '0x'],
      }),
    })
  }

  // todo: finalise fallback handler
  // actions.push({
  //   target: FALLBACK_HANDLER,
  //   value: BigInt(0),
  //   callData: encodeFunctionData({
  //     functionName: 'setFunctionSig',
  //     abi: ExtensibleFallbackHandler.abi,
  //     args: [
  //       {
  //         selector: functionSelector,
  //         fallbackType: BigInt(isStatic ? 0 : 1),
  //         handler: module.address,
  //       },
  //     ],
  //   }),
  // })
  return actions
}
