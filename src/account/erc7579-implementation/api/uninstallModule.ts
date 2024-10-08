import {
  PublicClient,
  encodeAbiParameters,
  encodeFunctionData,
  encodePacked,
  parseAbi,
} from 'viem'
import { Account, Execution } from '../../types'
import { Module, moduleTypeIds } from '../../../module/types'
import { isModuleInstalled } from './isModuleInstalled'
import { accountAbi } from '../constants/abis'
import { getPreviousModule } from '../../../common'

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
    case 'hook':
      return _uninstallModule({ client, account, module })
    case 'fallback':
      if (!module.selector) {
        throw new Error(
          `Selector param is required for module type ${module.type}`,
        )
      }
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
  const executions: Execution[] = []
  const isInstalled = await isModuleInstalled({ client, account, module })

  if (isInstalled) {
    let moduleData = module.deInitData || '0x'
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

    const data = encodeFunctionData({
      functionName: 'uninstallModule',
      abi: parseAbi(accountAbi),
      args: [BigInt(moduleTypeIds[module.type]), module.module, moduleData],
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

const _uninstallFallback = async ({
  client,
  account,
  module,
}: {
  client: PublicClient
  account: Account
  module: Module
}) => {
  const executions: Execution[] = []

  const isInstalled = await isModuleInstalled({
    client,
    account,
    module: {
      ...module,
      additionalContext: encodeAbiParameters(
        [{ name: 'functionSignature', type: 'bytes4' }],
        [module.selector!],
      ),
    },
  })

  if (isInstalled) {
    const data = encodeFunctionData({
      functionName: 'uninstallModule',
      abi: parseAbi(accountAbi),
      args: [
        BigInt(moduleTypeIds[module.type]),
        module.module,
        encodePacked(
          ['bytes4', 'bytes'],
          [module.selector!, module.deInitData],
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
