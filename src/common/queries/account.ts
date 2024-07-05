import { Account } from '../../account'
import { Address } from 'viem'
import { GRAPHQL_API_URL } from '../constants'

const query = `
    query ($smartAccount: String) {
      moduleQueries (where: { smartAccount: $smartAccount, isInstalled: true }) {
        module,
        moduleTypeId
      }
    }
  `

export const getInstalledModules = async ({
  account,
}: {
  account: Account
}): Promise<Address[]> => {
  const variables = {
    smartAccount: account.address,
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

  if (response.ok) {
    return responseBody.data.moduleQueries.map((module: any) => module.module)
  } else {
    throw new Error(
      `Error: ${responseBody.errors
        .map((error: any) => error.message)
        .join(', ')}`,
    )
  }
}
