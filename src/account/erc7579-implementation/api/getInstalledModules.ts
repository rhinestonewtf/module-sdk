import { Address, PublicClient, zeroAddress } from 'viem'
import { Account, Action } from '../../types'
import { ModuleType } from '../../../module/types'
import AccountInterface from '../constants/abis/ERC7579Implementation.json'
import { SENTINEL_ADDRESS } from '../../../common/constants'
import { isContract } from '../../../common/utils'
import { getInitData } from './getInitData'

export const getInstalledModules = async ({
  client,
  account,
  moduleTypes = ['validator', 'executor', 'hook', 'fallback'],
}: {
  client: PublicClient
  account: Account
  moduleTypes?: ModuleType[]
}): Promise<Address[]> => {
  const modules: Address[] = []
  if (await isContract({ client, address: account.address })) {
    for (const moduleType of moduleTypes) {
      switch (moduleType) {
        case 'validator':
          const validators = await getModulesPaginated({
            client,
            functionName: 'getValidatorPaginated',
            accountAddress: account.address,
          })
          validators && modules.push(...validators)
          break
        case 'executor':
          const executors = await getModulesPaginated({
            client,
            functionName: 'getExecutorsPaginated',
            accountAddress: account.address,
          })
          executors && modules.push(...executors)
          break
        case 'hook':
          const activeHook = (await client.readContract({
            address: account.address,
            abi: AccountInterface.abi,
            functionName: 'getActiveHook',
          })) as Address
          modules.push(activeHook)
          break
        case 'fallback':
        // todo: implement on account or use events
      }
    }
  } else if (account.initCode) {
    const initialModules = getInitData({ initCode: account.initCode })
    for (const moduleType of moduleTypes) {
      switch (moduleType) {
        case 'validator':
          for (const validator of initialModules.validators) {
            if (validator.module !== zeroAddress) {
              modules.push(validator.module)
            }
          }
          break
        case 'executor':
          for (const executor of initialModules.executors) {
            if (executor.module !== zeroAddress) {
              modules.push(executor.module)
            }
          }
          break
        case 'hook':
          for (const hook of initialModules.hooks) {
            if (hook.module !== zeroAddress) {
              modules.push(hook.module)
            }
          }
          break
        case 'fallback':
          for (const fallback of initialModules.fallbacks) {
            if (fallback.module !== zeroAddress) {
              modules.push(fallback.module)
            }
          }
          break
      }
    }
  } else {
    throw new Error('Account has no init code and is not deployed')
  }
  return modules
}

const getModulesPaginated = async ({
  client,
  functionName,
  accountAddress,
}: {
  client: PublicClient
  functionName: string
  accountAddress: Address
}) => {
  const data = (await client.readContract({
    address: accountAddress,
    abi: AccountInterface.abi,
    functionName: functionName,
    args: [SENTINEL_ADDRESS, 100],
  })) as [Address[], Address]
  return data[0]
}
