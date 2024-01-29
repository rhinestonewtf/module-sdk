import { Account, Action } from '../Account'
import { Address, Hex, PublicClient, encodeFunctionData } from 'viem'
import AccountInterface from '../constants/abis/ERC7579Interface.json'
import { isFallbackInstalled, isModuleInstalled } from './isModuleInstalled'
import { Module, moduleTypeIds } from '../../../module/common/Module'

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
      return installFallback(
        client,
        account,
        module.initData,
        false,
        module.address,
      )
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
        args: [moduleTypeIds[module.type], module.address, module.initData],
      }),
    })
  }
  return actions
}

async function installFallback(
  client: PublicClient,
  account: Account,
  functionSelector: Hex,
  isStatic: boolean,
  subHandler: Address,
): Promise<Action[]> {
  const actions: Action[] = []
  // TODO: this only checks if the queried handler is installed, but the account will also revert if any other handler is installed

  // TODO

  // const isHandlerInstalled = await isFallbackInstalled(
  //   client,
  //   account,
  //   account.contractDependencies.EXTENSIBLE_FALLBACK_HANDLER_ADDRESS
  // );

  // if (!isHandlerInstalled) {
  //   actions.push({
  //     target: account.address,
  //     value: BigInt(0),
  //     callData: encodeFunctionData({
  //       functionName: "installFallback",
  //       abi: AccountInterface.abi,
  //       args: [
  //         account.contractDependencies.EXTENSIBLE_FALLBACK_HANDLER_ADDRESS,
  //         "0x",
  //       ],
  //     }),
  //   });
  // }

  // actions.push({
  //   target: account.contractDependencies.EXTENSIBLE_FALLBACK_HANDLER_ADDRESS,
  //   value: BigInt(0),
  //   callData: encodeFunctionData({
  //     functionName: "setFunctionSig",
  //     abi: ExtensibleFallbackHandler.abi,
  //     args: [
  //       {
  //         selector: functionSelector,
  //         fallbackType: BigInt(isStatic ? 0 : 1),
  //         handler: subHandler,
  //       },
  //     ],
  //   }),
  // });
  return actions
}
