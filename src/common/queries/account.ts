import { Address, PublicClient } from 'viem'
import { INDEXER_URL } from '../constants'
import { Account } from '../../account'

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

  const response = await fetch(INDEXER_URL, {
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
      (module: any) => module.module,
    )
  } else {
    throw new Error(
      `Error: ${responseBody.errors
        .map((error: any) => error.message)
        .join(', ')}`,
    )
  }
}
