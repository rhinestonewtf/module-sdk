import { GRAPHQL_API_URL } from '../constants'

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

export const getRegistryModules = async (): Promise<any> => {
  const response = await fetch(GRAPHQL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
    }),
  })

  const responseBody = await response.json()

  if (response.ok) {
    return responseBody.data.moduleRegistrations
  } else {
    throw new Error(
      `Error: ${responseBody.errors.map((error: any) => error.message).join(', ')}`,
    )
  }
}
