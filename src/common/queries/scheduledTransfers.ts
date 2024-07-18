import { Account } from '../../account'
import { Address } from 'viem'
import { GRAPHQL_API_URL } from '../constants'

const query = `
    query ($smartAccount: String) {
      scheduledTransfersExecutionAddedQueries (where:{ smartAccount: $smartAccount}) {
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

export const getScheduledTransfers = async ({
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
    return responseBody.data.scheduledTransfersExecutionAddedQueries // responseBody.data.moduleQueries.map((module: any) => module.module)
  } else {
    throw new Error(
      `Error: ${responseBody.errors.map((error: any) => error.message).join(', ')}`,
    )
  }
}

const queryById = `
    query ($smartAccount: String, $jobId: String) {
      scheduledTransfersExecutionAddedQueries (where:{ smartAccount: $smartAccount, jobId: $jobId}) {
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

export const getScheduledTransferByJobId = async ({
  smartAccount,
  jobId,
}: {
  smartAccount: string
  jobId: string
}): Promise<Address[]> => {
  const variables = {
    smartAccount,
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
    return responseBody.data.scheduledTransfersExecutionAddedQueries[0]
  } else {
    throw new Error(
      `Error: ${responseBody.errors.map((error: any) => error.message).join(', ')}`,
    )
  }
}
