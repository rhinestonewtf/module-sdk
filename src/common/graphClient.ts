import { GRAPHQL_API_URL } from './constants'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'

export const client = new ApolloClient({
  uri: GRAPHQL_API_URL,
  cache: new InMemoryCache(),
})
