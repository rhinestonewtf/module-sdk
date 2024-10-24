import { Address, PublicClient } from 'viem'
import { INDEXER_URL } from '../constants'
import { Account } from '../../account'

const query = `
    query ($smartAccount: String, $chainId: Int) {
      ScheduledOrders_ExecutionQuery (where:{ smartAccount: { _eq: $smartAccount }, chainId: { _eq: $chainId }}) {
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
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<Address[]> => {
  const variables = {
    smartAccount: account.address,
    chainId: client.chain?.id,
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
    return responseBody.data.ScheduledOrders_ExecutionQuery
  } else {
    throw new Error(
      `Error: ${responseBody.errors.map((error: any) => error.message).join(', ')}`,
    )
  }
}

const queryById = `
    query ($smartAccount: String, $jobId: numeric, $chainId: Int) {
      ScheduledOrders_ExecutionQuery (where:{smartAccount: { _eq: $smartAccount }, jobId: { _eq: $jobId }, chainId: { _eq: $chainId }}) {
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
  account,
  client,
}: {
  account: Account
  jobId: number
  client: PublicClient
}): Promise<Address[]> => {
  const variables = {
    smartAccount: account.address,
    jobId,
    chainId: await client.getChainId(),
  }

  const response = await fetch(INDEXER_URL, {
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
    return responseBody.data.ScheduledOrders_ExecutionQuery[0]
  } else {
    throw new Error(
      `Error: ${responseBody.errors.map((error: any) => error.message).join(', ')}`,
    )
  }
}
