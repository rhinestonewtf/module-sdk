import { client } from '../graphClient'
import { gql } from '@apollo/client/core'

const query = `
  query {
    moduleRegistrations {
        id
        implementation
        sender
        resolver
      }
  }
`

export const getRegistryModules = async (): Promise<any> =>
  client
    .query({
      query: gql(query),
    })
    .then((data) => data.data.moduleRegistrations)
    .catch((err) => {
      console.log('Error fetching data: ', err)
    })
