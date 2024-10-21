import { PublicClient } from 'viem'
import { INDEXER_URL } from '../constants'

const query = `
  query ($chainId: Int) {
     Registry_ModuleRegistration (where: { chainId: { _eq: $chainId } }) {
        id
        implementation
      }
  }
`

export const getRegistryModules = async ({
  client,
}: {
  client: PublicClient
}): Promise<any> => {
  const variables = {
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
    return responseBody.data.Registry_ModuleRegistration
  } else {
    throw new Error(
      `Error: ${responseBody.errors
        .map((error: any) => error.message)
        .join(', ')}`,
    )
  }
}
