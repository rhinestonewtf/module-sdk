import {
  PublicClient,
  encodeAbiParameters,
  encodeFunctionData,
  slice,
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
          module.data || '0x',
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
    executions.push({
      target: account.address,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: 'uninstallModule',
        abi: parseAbi(accountAbi),
        args: [
          BigInt(kernelModuleTypeIds[module.type]),
          module.module,
          module.data ?? '0x',
        ],
      }),
    })
  }

  return executions
}
