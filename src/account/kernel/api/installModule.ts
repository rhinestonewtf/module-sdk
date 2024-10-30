import { Account, Execution } from '../../types'
import {
  PublicClient,
  encodeAbiParameters,
  encodeFunctionData,
  encodePacked,
  parseAbi,
  zeroAddress,
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

  if (!isInstalled) {
    const data = encodeFunctionData({
      functionName: 'installModule',
      abi: parseAbi(accountAbi),
      args: [
        BigInt(kernelModuleTypeIds[module.type]),
        module.module,
        withHook
          ? encodePacked(
              ['address', 'bytes'],
              [
                module.hook ?? zeroAddress,
                encodeAbiParameters(
                  [{ type: 'bytes' }, { type: 'bytes' }],
                  [module.initData || '0x', '0x'],
                ),
              ],
            )
          : module.initData || '0x',
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

async function installFallback({
  client,
  account,
  module,
}: {
  client: PublicClient
  account: Account
  module: KernelModule
}): Promise<Execution[]> {
  if (!module.selector || !module.callType) {
    throw new Error(
      `Hook, selector and callType are required for module type ${module.type}`,
    )
  }

  const executions: Execution[] = []

  const isInstalled = await isModuleInstalled({
    client,
    account,
    module,
  })

  if (!isInstalled) {
    const data = encodeFunctionData({
      functionName: 'installModule',
      abi: parseAbi(accountAbi),
      args: [
        BigInt(kernelModuleTypeIds[module.type]),
        module.module,
        encodePacked(
          ['bytes4', 'address', 'bytes'],
          [
            module.selector,
            module.hook ?? zeroAddress,
            encodeAbiParameters(
              [{ type: 'bytes' }, { type: 'bytes' }],
              [
                encodePacked(
                  ['bytes1', 'bytes'],
                  [module.callType, module.initData || '0x'],
                ),
                '0x',
              ],
            ),
          ],
        ),
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
