import { Account, Execution } from '../../types'
import {
  PublicClient,
  encodeAbiParameters,
  encodeFunctionData,
  encodePacked,
  parseAbi,
  slice,
} from 'viem'
import { isModuleInstalled } from './isModuleInstalled'
import { accountAbi } from '../constants/abis'
import { KernelModule, kernelModuleTypeIds } from '../types'

export const installModule = ({
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
      return _installModule({ client, account, module, withHook: true })
    case 'hook':
    case 'policy':
    case 'signer':
      return _installModule({ client, account, module, withHook: false })
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
  withHook = false,
}: {
  client: PublicClient
  account: Account
  module: KernelModule
  withHook: boolean
}) => {
  const executions: Execution[] = []
  const isInstalled = await isModuleInstalled({ client, account, module })

  if (withHook && !module.hook) {
    throw new Error(`Hook is required for module type ${module.type}`)
  }

  if (!isInstalled) {
    executions.push({
      target: account.address,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: 'installModule',
        abi: parseAbi(accountAbi),
        args: [
          BigInt(kernelModuleTypeIds[module.type]),
          module.module,
          withHook
            ? encodePacked(
                ['address', 'bytes'],
                [module.hook!, module.data || '0x'],
              )
            : module.data || '0x',
        ],
      }),
    })
  }
  return executions
}

async function installFallback({
  client,
  account,
  module,
}: {
  client: PublicClient
  account: Account
  module: KernelModule
}): Promise<Execution[]> {
  if (!module.hook) {
    throw new Error(`Hook is required for module type ${module.type}`)
  }

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

  if (!isInstalled) {
    executions.push({
      target: account.address,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: 'installModule',
        abi: parseAbi(accountAbi),
        args: [
          BigInt(kernelModuleTypeIds[module.type]),
          module.module,
          encodePacked(
            ['address', 'bytes'],
            [module.hook, module.data || '0x'],
          ),
        ],
      }),
    })
  }

  return executions
}
