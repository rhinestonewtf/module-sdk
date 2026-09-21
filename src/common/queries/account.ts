import { Address, PublicClient } from 'viem'
import { Account } from '../../account'
import { GLOBAL_CONSTANTS } from '../../constants'

const query = `
    query ($smartAccount: String, $chainId: Int) {
       SmartAccount_ModuleQuery (where: { smartAccount: { _eq: $smartAccount }, isInstalled: { _eq: true }, chainId: { _eq: $chainId }}) {
        moduleAddress,
        moduleTypeId
      }
    }
  `

const queryIndexer = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<{ moduleAddress: Address; moduleTypeId: number }[]> => {
  const variables = {
    smartAccount: account.address,
    chainId: await client.getChainId(),
  }

  const response = await fetch(GLOBAL_CONSTANTS.INDEXER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const responseBody = await response.json()

  if (response.ok) {
    return responseBody.data.SmartAccount_ModuleQuery.map(
      (module: any) => ({
        moduleAddress: module.moduleAddress,
        moduleTypeId: module.moduleTypeId,
      }),
    )
  } else {
    throw new Error(
      `Error: ${responseBody.errors
        .map((error: any) => error.message)
        .join(', ')}`,
    )
  }
}

export const getInstalledModules = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<Address[]> => {
  const modules = await queryIndexer({ account, client })
  return modules.map((module) => module.moduleAddress)
}

// Same indexer query as `getInstalledModules`, but preserves `moduleTypeId`
// instead of discarding it, so callers that need to distinguish module
// types (e.g. finding the previous entry in a specific per-type linked
// list) don't have to re-derive it from an address-only list.
export const getInstalledModulesWithType = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<{ moduleAddress: Address; moduleTypeId: number }[]> => {
  return queryIndexer({ account, client })
}
