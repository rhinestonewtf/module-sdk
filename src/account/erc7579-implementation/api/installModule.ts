import { Account, Action } from '../../Account'
import {
  Address,
  Hex,
  PublicClient,
  decodeAbiParameters,
  encodeAbiParameters,
  encodeFunctionData,
  encodePacked,
  slice,
} from 'viem'
import AccountInterface from '../constants/abis/ERC7579Implementation.json'
import ExtensibleFallbackHandler from '../constants/abis/ExtensibleFallbackHandler.json'
import { isModuleInstalled } from './isModuleInstalled'
import { Module, moduleTypeIds } from '../../../module/Module'

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
        args: [moduleTypeIds[module.type], module.module, module.data || '0x'],
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

  const selector = slice(module.data!, 0, 4)
  const isInstalled = await isModuleInstalled({
    client,
    account,
    module: {
      ...module,
      additionalContext: encodeAbiParameters(
        [{ name: 'functionSignature', type: 'bytes4' }],
        [selector],
      ),
    },
  })

  if (!isInstalled) {
    actions.push({
      target: account.address,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: 'installModule',
        abi: AccountInterface.abi,
        args: [moduleTypeIds[module.type], module.module, module.data],
      }),
    })
  }

  return actions
}
