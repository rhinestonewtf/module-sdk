import { Account } from 'src/account'
import { client } from '../graphClient'
import { gql } from '@apollo/client/core'
import { Address } from 'viem'

export const getInstalledModules = async ({
  account,
}: {
  account: Account
}): Promise<Address[]> => {
  const query = `
    query ($smartAccount: String) {
      moduleQueries (where: { smartAccount: $smartAccount, isInstalled: true }) {
        module,
        moduleTypeId
      }
    }
  `

  return client
    .query({
      query: gql(query),
      variables: { smartAccount: account.address },
    })
    .then((data) => {
      return data.data.moduleQueries.map((module: any) => module.module)
    })

    .catch((err) => {
      console.log('Error fetching data: ', err)
    })
}
