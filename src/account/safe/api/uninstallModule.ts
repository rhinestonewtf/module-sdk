import {
  PublicClient,
  encodeAbiParameters,
  encodeFunctionData,
  parseAbi,
  parseAbiParameters,
  Hex,
} from 'viem'
import { Account, Execution } from '../../types'
import { isModuleInstalled } from './isModuleInstalled'
import { accountAbi } from '../constants/abis'
import { Module, moduleTypeIds } from 'src/module/types'
import { getPreviousModule } from 'src/common/getPrevModule'

export const uninstallModule = ({
  client,
  account,
  module,
}: {
  client: PublicClient
  account: Account
  module: Module
}): Promise<Execution[]> => {
  switch (module.type) {
    case 'validator':
    case 'executor':
      return _uninstallModule({ client, account, module })

    case 'hook':
      if (!module.selector || module.hookType === undefined) {
        throw new Error(
          `hookType and selector params are required for module type ${module.type}`,
        )
      }
      return _uninstallModule({ client, account, module })

    case 'fallback':
      if (!module.functionSig) {
        throw new Error(
          `functionSig param is required for module type ${module.type}`,
        )
      }
      return _uninstallModule({ client, account, module })
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
  const executions: Execution[] = []
  const isInstalled = await isModuleInstalled({ client, account, module })

  if (isInstalled) {
    let moduleData = getModuleCalldata(module)

    if (module.type === 'validator' || module.type === 'executor') {
      const prev = await getPreviousModule({ client, account, module })
      moduleData = encodeAbiParameters(
        [
          { name: 'prev', type: 'address' },
          { name: 'moduleInitData', type: 'bytes' },
        ],
        [prev, moduleData],
      )
    }
    executions.push({
      target: account.address,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: 'uninstallModule',
        abi: parseAbi(accountAbi),
        args: [BigInt(moduleTypeIds[module.type]), module.module, moduleData],
      }),
    })
  }

  return executions
}

const getModuleCalldata = (module: Module): Hex => {
  switch (module.type) {
    case 'validator':
    case 'executor':
      return module.data || '0x'
    case 'hook':
      return encodeAbiParameters(
        parseAbiParameters(
          'HookType hookType, bytes4 selector, bytes memory initData',
        ),
        [module.hookType, module.selector!, module.data || '0x'],
      )
    case 'fallback':
      return encodeAbiParameters(
        parseAbiParameters('bytes4 functionSig, bytes memory moduleDeInitData'),
        [module.functionSig!, module.data || '0x'],
      )
    default:
      throw new Error(`Unknown module type ${module.type}`)
  }
}
