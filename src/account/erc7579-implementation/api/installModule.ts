import { Account, Execution } from '../../types'
import { PublicClient, encodeFunctionData, encodePacked, parseAbi } from 'viem'
import { isModuleInstalled } from './isModuleInstalled'
import { Module, moduleTypeIds } from '../../../module/types'
import { accountAbi } from '../constants/abis'

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
    case 'hook':
      return _installModule({ client, account, module })
    case 'fallback':
      if (!module.selector || !module.callType) {
        throw new Error(
          `Selector and callType params are required for module type ${module.type}`,
        )
      }
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
  const executions: Execution[] = []
  const isInstalled = await isModuleInstalled({ client, account, module })

  if (!isInstalled) {
    const data = encodeFunctionData({
      functionName: 'installModule',
      abi: parseAbi(accountAbi),
      args: [
        BigInt(moduleTypeIds[module.type]),
        module.module,
        module.initData || '0x',
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
  module: Module
}): Promise<Execution[]> {
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
        BigInt(moduleTypeIds[module.type]),
        module.module,
        encodePacked(
          ['bytes4', 'bytes1', 'bytes'],
          [module.selector!, module.callType!, module.initData ?? '0x'],
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
