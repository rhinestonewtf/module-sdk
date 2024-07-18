import { Account } from '../../account'
import { Address } from 'viem'
import { GRAPHQL_API_URL } from '../constants'

const query = `
    query ($smartAccount: String) {
      scheduledOrdersExecutionAddedQueries (where:{ smartAccount: $smartAccount}) {
        id
        jobId
        smartAccount
        executeInterval
        numberOfExecutions
        numberOfExecutionsCompleted
        startDate
        isEnabled
      }
    }
  `

export const getScheduledOrders = async ({
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
    return responseBody.data.scheduledOrdersExecutionAddedQueries // responseBody.data.moduleQueries.map((module: any) => module.module)
  } else {
    throw new Error(
      `Error: ${responseBody.errors.map((error: any) => error.message).join(', ')}`,
    )
  }
}

const queryById = `
    query ($jobId: String) {
      scheduledOrdersExecutionAddedQueries (where:{ jobId: $jobId}) {
        id
        jobId
        smartAccount
        executeInterval
        numberOfExecutions
        numberOfExecutionsCompleted
        startDate
        isEnabled
      }
    }
  `

export const getScheduledOrderByJobId = async ({
  jobId,
}: {
  jobId: string
}): Promise<Address[]> => {
  const variables = {
    jobId,
  }

  const response = await fetch(GRAPHQL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: queryById,
      variables,
    }),
  })

  const responseBody = await response.json()

  if (response.ok) {
    return responseBody.data.scheduledOrdersExecutionAddedQueries[0]
  } else {
    throw new Error(
      `Error: ${responseBody.errors.map((error: any) => error.message).join(', ')}`,
    )
  }
}
