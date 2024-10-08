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
import { Module, moduleTypeIds } from '../../../module/types'

export const installModule = ({
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
  module: Module
}) => {
  const executions: Execution[] = []
  const isInstalled = await isModuleInstalled({ client, account, module })

  if (!isInstalled) {
    const data = encodeFunctionData({
      functionName: 'installModule',
      abi: parseAbi(accountAbi),
      args: [
        BigInt(moduleTypeIds[module.type]),
        module.module,
        getModuleCalldata(module),
      ],
    })

    executions.push({
      to: account.address,
      target: account.address,
      value: BigInt(0),
      callData: data,
      data,
    })
  }
  return executions
}

const getModuleCalldata = (module: Module): Hex => {
  switch (module.type) {
    case 'validator':
    case 'executor':
      return module.initData || '0x'
    case 'hook':
      return encodeAbiParameters(
        parseAbiParameters(
          'uint8 hookType, bytes4 selector, bytes memory initData',
        ),
        [module.hookType!, module.selector!, module.initData || '0x'],
      )
    case 'fallback':
      return encodeAbiParameters(
        parseAbiParameters(
          'bytes4 functionSig, bytes1 calltype, bytes memory initData',
        ),
        [module.functionSig!, module.callType!, module.initData || '0x'],
      )
    default:
      throw new Error(`Unknown module type ${module.type}`)
  }
}
