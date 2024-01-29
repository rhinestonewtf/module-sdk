import { Address, Hex, PublicClient, encodeFunctionData } from 'viem'
import { Account, Action } from '../Account'
import { Module, moduleTypeIds } from '../../../module/common/Module'
import { isModuleInstalled } from './isModuleInstalled'
import AccountInterface from '../constants/abis/ERC7579Interface.json'

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
      return uninstallFallback(
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
        args: [moduleTypeIds[module.type], module.address, module.initData],
      }),
    })
  }
  return actions
}

async function uninstallFallback(
  client: PublicClient,
  account: Account,
  functionSelector: Hex,
  isStatic: boolean,
  subHandler: Address,
): Promise<Action[]> {
  const actions: Action[] = []
  // TODO
  return actions
}
