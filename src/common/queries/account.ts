import { Address } from 'viem'
import { Account } from 'src/account'
import { GRAPHQL_API_URL } from '../constants'

export const getInstalledModules = async ({
  account,
}: {
  account: Account
}): Promise<Address[]> => {
  const query = `
    query {
      moduleQueries (where: { smartAccount: ${account.address}, isInstalled: true }) {
        module,
        moduleTypeId
      }
    }
  `

  return fetch(GRAPHQL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: query,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      return data.data
    })
    .catch((err) => {
      console.log('Error fetching data: ', err)
    })
}
