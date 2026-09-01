import { PublicClient, Address, getAddress, parseAbi } from 'viem'
import { Module } from '..'
import { SENTINEL_ADDRESS } from './constants'
import { getInstalledModulesWithType } from './queries/account'
import { Account } from '../account'
import { moduleTypeIds } from '../module/types'

// `getValidatorsPaginated`/`getExecutorsPaginated` have the identical
// signature across the safe / erc7579-implementation / nexus account
// types (the only three account types that ever call
// `getPreviousModule` - see `_uninstallModule` in each), so one shared
// ABI fragment is safe to reuse here rather than importing a
// per-account-type copy.
const paginatedModulesAbi = parseAbi([
  'function getValidatorsPaginated(address cursor, uint256 size) view returns (address[], address)',
  'function getExecutorsPaginated(address cursor, uint256 size) view returns (address[], address)',
])

// Only 'validator' and 'executor' modules are linked-list-ordered and
// ever reach this function; 'hook'/'fallback' uninstalls never call
// `getPreviousModule` (see `_uninstallModule` in
// safe/erc7579-implementation/nexus's `uninstallModule.ts`).
const getInstalledModulesForType = async ({
  account,
  client,
  moduleType,
}: {
  account: Account
  client: PublicClient
  moduleType: 'validator' | 'executor'
}): Promise<Address[]> => {
  try {
    const modules = await getInstalledModulesWithType({ account, client })
    const targetTypeId = moduleTypeIds[moduleType]
    return modules
      .filter((module) => module.moduleTypeId === targetTypeId)
      .map((module) => module.moduleAddress)
  } catch (e) {
    // Indexer unreachable or errored - fall back to reading the
    // on-chain paginated list directly, scoped to the same module
    // type so this can never mix a validator's neighbours with an
    // executor's (or vice versa).
    const functionName =
      moduleType === 'validator'
        ? 'getValidatorsPaginated'
        : 'getExecutorsPaginated'
    const [modules] = await client.readContract({
      address: account.address,
      abi: paginatedModulesAbi,
      functionName,
      args: [SENTINEL_ADDRESS, 100n],
    })
    return [...modules]
  }
}

export const getPreviousModule = async ({
  account,
  module,
  client,
}: {
  client: PublicClient
  account: Account
  module: Module
}): Promise<Address> => {
  if (module.type !== 'validator' && module.type !== 'executor') {
    throw new Error(
      `getPreviousModule only supports 'validator' and 'executor' modules, got '${module.type}'`,
    )
  }
  const installedModules = await getInstalledModulesForType({
    account,
    client,
    moduleType: module.type,
  })
  const index = installedModules.indexOf(getAddress(module.module))
  if (index === 0) {
    return SENTINEL_ADDRESS
  } else if (index > 0) {
    return installedModules[index - 1]
  } else {
    throw new Error(`Module ${module.module} not found in installed modules`)
  }
}
