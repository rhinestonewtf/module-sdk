import { Account, Execution } from '../../types'
import {
  Hex,
  PublicClient,
  encodeAbiParameters,
  encodeFunctionData,
  parseAbi,
  parseAbiParameters,
} from 'viem'
import { isModuleInstalled } from './isModuleInstalled'
import { accountAbi } from '../constants/abis'
import { moduleTypeIds } from 'src/module/types'
import { SafeModule } from '../types'

export const installModule = ({
  client,
  account,
  module,
}: {
  client: PublicClient
  account: Account
  module: SafeModule
}): Promise<Execution[]> => {
  switch (module.type) {
    case 'validator':
    case 'executor':
      return _installModule({ client, account, module })
    case 'hook':
      if (!module.selector || module.hookType === undefined) {
        throw new Error(
          `hookType and selector params are required for module type ${module.type}`,
        )
      }
      return _installModule({ client, account, module })
    case 'fallback':
      if (!module.functionSig || !module.callType) {
        throw new Error(
          `functionSig and callType params are required for module type ${module.type}`,
        )
      }
      return _installModule({ client, account, module })
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
  module: SafeModule
}) => {
  const executions: Execution[] = []
  const isInstalled = await isModuleInstalled({ client, account, module })

  if (!isInstalled) {
    executions.push({
      target: account.address,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: 'installModule',
        abi: parseAbi(accountAbi),
        args: [
          BigInt(moduleTypeIds[module.type]),
          module.module,
          getModuleCalldata(module),
        ],
      }),
    })
  }
  return executions
}

const getModuleCalldata = (module: SafeModule): Hex => {
  switch (module.type) {
    case 'validator':
    case 'executor':
      return module.data || '0x'
    case 'hook':
      return encodeAbiParameters(
        parseAbiParameters(
          'uint8 hookType, bytes4 selector, bytes memory initData',
        ),
        [module.hookType!, module.selector!, module.data || '0x'],
      )
    case 'fallback':
      return encodeAbiParameters(
        parseAbiParameters(
          'bytes4 functionSig, bytes1 calltype, bytes memory initData',
        ),
        [module.functionSig!, module.callType!, module.data || '0x'],
      )
    default:
      throw new Error(`Unknown module type ${module.type}`)
  }
}
