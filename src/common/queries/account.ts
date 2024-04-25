import { Address } from 'viem'
import { Account } from 'src/account'
import { gql } from '@apollo/client'
import { client } from 'src/common/graphQLClient'

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
  return client
    .query({
      query: gql(query),
      variables: { smartAccount: account.address },
    })
    .then((data) => {
      return data.data
    })
    .catch((err) => {
      console.log('Error fetching data: ', err)
    })
}
