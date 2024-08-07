import {
  PublicClient,
  encodeAbiParameters,
  encodeFunctionData,
  encodePacked,
  parseAbi,
} from 'viem'
import { Account, Execution } from '../../types'
import { isModuleInstalled } from './isModuleInstalled'
import { accountAbi } from '../constants/abis'
import { KernelModule, kernelModuleTypeIds } from '../types'

export const uninstallModule = ({
  client,
  account,
  module,
}: {
  client: PublicClient
  account: Account
  module: KernelModule
}): Promise<Execution[]> => {
  switch (module.type) {
    case 'validator':
    case 'executor':
    case 'hook':
    case 'policy':
    case 'signer':
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
  module: KernelModule
}) => {
  const executions: Execution[] = []
  const isInstalled = await isModuleInstalled({ client, account, module })

  if (isInstalled) {
    executions.push({
      target: account.address,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: 'uninstallModule',
        abi: parseAbi(accountAbi),
        args: [
          BigInt(kernelModuleTypeIds[module.type]),
          module.module,
          module.initData || '0x',
        ],
      }),
    })
  }
  return executions
}

const _uninstallFallback = async ({
  client,
  account,
  module,
}: {
  client: PublicClient
  account: Account
  module: KernelModule
}) => {
  const executions: Execution[] = []

  const isInstalled = await isModuleInstalled({
    client,
    account,
    module: {
      ...module,
      initData:
        encodeAbiParameters(
          [{ name: 'functionSignature', type: 'bytes4' }],
          [module.selector!],
        ) || '0x',
    },
  })

  if (isInstalled) {
    executions.push({
      target: account.address,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: 'uninstallModule',
        abi: parseAbi(accountAbi),
        args: [
          BigInt(kernelModuleTypeIds[module.type]),
          module.module,
          encodePacked(
            ['bytes4', 'bytes'],
            [module.selector!, module.initData || '0x'],
          ),
        ],
      }),
    })
  }

  return executions
}
