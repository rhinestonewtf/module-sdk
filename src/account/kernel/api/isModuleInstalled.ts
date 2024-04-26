import { PublicClient, parseAbi } from 'viem'
import { Account } from '../../types'
import { isContract } from '../../../common/utils'
import { accountAbi } from '../constants/abis'
import { KernelModule, kernelModuleTypeIds } from '../types'

export const isModuleInstalled = async ({
  client,
  account,
  module,
}: {
  client: PublicClient
  account: Account
  module: KernelModule
}): Promise<boolean> => {
  switch (module.type) {
    case 'validator':
    case 'executor':
    case 'hook':
    case 'fallback':
    case 'policy':
    case 'signer':
      return await _isModuleInstalled({ client, account, module })
    default:
      throw new Error(`Unknown module type ${module.type}`)
  }
}

const _isModuleInstalled = async ({
  client,
  account,
  module,
}: {
  client: PublicClient
  account: Account
  module: KernelModule
}): Promise<boolean> => {
  if (await isContract({ client, address: account.address })) {
    return (await client.readContract({
      address: account.address,
      abi: parseAbi(accountAbi),
      functionName: 'isModuleInstalled',
      args: [
        kernelModuleTypeIds[module.type],
        module.module,
        module.additionalContext,
      ],
    })) as boolean
  }

  return false
}
