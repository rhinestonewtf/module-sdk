import { Address, Hex, PublicClient } from 'viem'
import { Account } from '../Account'
import AccountInterface from '../constants/abis/ERC7579Interface.json'
import { Module, moduleTypeIds } from '../../../module/common/Module'
import { isContract } from '../../../common/utils'

function getInitializationDataFromInitcode(initCode: Address): any {
  // todo
}

export const isModuleInstalled = ({
  client,
  account,
  module,
}: {
  client: PublicClient
  account: Account
  module: Module
}): Promise<boolean> => {
  switch (module.type) {
    case 'validator':
    case 'executor':
    case 'hook':
      return _isModuleInstalled({ client, account, module })
    case 'fallback':
      return isFallbackInstalled(client, account, module.address)
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
  module: Module
}): Promise<boolean> => {
  let isModuleInstalled = false

  if (await isContract(client, account.address)) {
    isModuleInstalled = (await client.readContract({
      address: account.address,
      abi: AccountInterface.abi,
      functionName: 'isModuleInstalled',
      args: [
        moduleTypeIds[module.type],
        module.address,
        module.additionalContext,
      ],
    })) as boolean
  } else {
    // todo
    // const { initialValidators } = getInitializationDataFromInitcode(
    //   account.initCode,
    // )
    // isModuleInstalled = initialValidators.some(
    //   (validatorModule: Module) => validatorModule.address === module.address,
    // )
  }
  return isModuleInstalled
}

export async function isFallbackInstalled(
  client: PublicClient,
  account: Account,
  fallbackHandler: Address,
): Promise<boolean> {
  let isModuleInstalled = false

  if (await isContract(client, account.address)) {
    isModuleInstalled = (await client.readContract({
      address: account.address,
      abi: AccountInterface.abi,
      functionName: 'isFallbackInstalled',
      args: [fallbackHandler],
    })) as boolean
  } else {
    const { initialFallback } = getInitializationDataFromInitcode(
      account.initCode,
    )
    isModuleInstalled = initialFallback.module === fallbackHandler
  }
  return isModuleInstalled
}
