import { Address, PublicClient } from 'viem'
import { GRAPHQL_API_URL, SENTINEL_ADDRESS } from '../constants'
import { Account } from '../../account'
import { isSmartAccountDeployed } from 'permissionless'

const query = `
    query ($smartAccount: String, $chainId: Int) {
       SmartAccount_ModuleQuery (where: { smartAccount: { _eq: $smartAccount }, isInstalled: { _eq: true }, chainId: { _eq: $chainId }}) {
        moduleAddress,
        moduleTypeId
      }
    }
  `

export const getInstalledModules = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<Address[]> => {
  const variables = {
    smartAccount: account.address,
    chainId: await client.getChainId(),
  }

  const isDeployed = await isSmartAccountDeployed(
    // Review: getting ts error here but works if we ignore
    // @ts-ignore
    client,
    account.address,
  )

  if (!isDeployed) {
    return []
  }

  const response = await fetch(GRAPHQL_API_URL, {
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
  const modules = responseBody.data.SmartAccount_ModuleQuery.map(
    (module: any) => module.moduleAddress,
  )
  // @Review: response.ok is still true even if:
  // 1. Indexer does not support passed network
  // 2. Smart account is not deployed or compatible
  // This means that modules will be an empty array if something goes wrong
  // @Recommendation: response.ok should be false if something goes wrong
  if (response.ok && modules.length > 0) {
    return modules
  } else {
    const installedModules = await client.readContract({
      address: account.address,
      functionName: 'getValidatorsPaginated',
      args: [SENTINEL_ADDRESS, 100n],  // @Review
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "cursor",
              type: "address"
            },
            {
              internalType: "uint256",
              name: "size",
              type: "uint256"
            }
          ],
          name: "getValidatorsPaginated",
          outputs: [
            {
              internalType: "address[]",
              name: "array",
              type: "address[]"
            },
            {
              internalType: "address",
              name: "next",
              type: "address"
            }
          ],
          stateMutability: "view",
          type: "function"
        }
      ],
    })
    return installedModules[0] as Address[]
  }
}
