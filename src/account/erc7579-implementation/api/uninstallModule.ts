import {
  Address,
  PublicClient,
  encodeAbiParameters,
  encodeFunctionData,
  slice,
  getAddress,
} from 'viem'
import { Account, Action } from '../../Account'
import { Module, moduleTypeIds } from '../../../module/Module'
import { isModuleInstalled } from './isModuleInstalled'
import AccountInterface from '../constants/abis/ERC7579Implementation.json'
import { getInstalledModules } from './getInstalledModules'
import { SENTINEL_ADDRESS } from '../../../common/constants'

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
    let moduleData = module.data || '0x'
    if (module.type === 'validator' || module.type === 'executor') {
      const prev = await getPreviousModule({ client, account, module })
      moduleData = encodeAbiParameters(
        [
          { name: 'prev', type: 'address' },
          { name: 'disableModuleData', type: 'bytes' },
        ],
        [prev, moduleData],
      )
    }
    actions.push({
      target: account.address,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: 'uninstallModule',
        abi: AccountInterface.abi,
        args: [moduleTypeIds[module.type], module.module, moduleData],
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

  if (isInstalled) {
    actions.push({
      target: account.address,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: 'uninstallModule',
        abi: AccountInterface.abi,
        args: [moduleTypeIds[module.type], module.module, module.data],
      }),
    })
  }

  return actions
}

const getPreviousModule = async ({
  client,
  account,
  module,
}: {
  client: PublicClient
  account: Account
  module: Module
}): Promise<Address> => {
  let insalledModules = await getInstalledModules({
    client,
    account,
    moduleTypes: [module.type],
  })
  const index = insalledModules.indexOf(getAddress(module.module))
  if (index === 0) {
    return SENTINEL_ADDRESS
  } else if (index > 0) {
    return insalledModules[index - 1]
  } else {
    throw new Error(`Module ${module.module} not found in installed modules`)
  }
}
