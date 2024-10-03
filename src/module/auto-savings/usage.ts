import { Address, encodeFunctionData, getAddress, PublicClient } from 'viem'
import { AUTO_SAVINGS_ADDRESS } from './constants'
import { abi } from './abi'
import { Execution } from '../../account'
import { SENTINEL_ADDRESS } from '../../common/constants'
import { Account } from '../../account'
import { getSwapDetails } from '../utils/uniswap'

type Params = {
  token: Address
  config: {
    percentage: bigint
    vault: Address
  }
}

export const getSetAutoSavingConfigAction = ({
  token,
  config,
}: Params): Execution => {
  return {
    target: AUTO_SAVINGS_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'setConfig',
      abi,
      args: [token, config],
    }),
  }
}

export const getAutoSavingTokens = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<Address[]> => {
  try {
    const tokens = (await client.readContract({
      address: AUTO_SAVINGS_ADDRESS,
      abi,
      functionName: 'getTokens',
      args: [account.address],
    })) as Address[]

    return tokens
  } catch (err) {
    console.error(err)
    return []
  }
}

export const getDeleteAutoSavingConfigAction = async ({
  account,
  client,
  token,
}: {
  account: Account
  client: PublicClient
  token: Address
}): Promise<Execution> => {
  try {
    const allTokens = await getAutoSavingTokens({ account, client })

    let prevToken: Address

    const currentTokenIndex = allTokens.findIndex((t) => t === token)

    if (currentTokenIndex === -1) {
      throw new Error('Token not found')
    } else if (currentTokenIndex === 0) {
      prevToken = SENTINEL_ADDRESS
    } else {
      prevToken = getAddress(allTokens[currentTokenIndex - 1])
    }

    return {
      target: AUTO_SAVINGS_ADDRESS,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: 'deleteConfig',
        abi,
        args: [prevToken, token],
      }),
    }
  } catch {
    throw new Error(`Failed to delete config for token ${token}`)
  }
}

export const getAutoSaveAction = async ({
  token,
  amountReceived,
}: {
  token: Address
  amountReceived: number
}): Promise<Execution> => {
  const swapDetails = getSwapDetails()
  try {
    return {
      target: AUTO_SAVINGS_ADDRESS,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: 'autoSave',
        abi,
        args: [
          token,
          BigInt(amountReceived),
          swapDetails.sqrtPriceLimitX96,
          swapDetails.amountOutMin,
          swapDetails.fee,
        ],
      }),
    }
  } catch {
    throw new Error(`Failed to create autosave action for token ${token}`)
  }
}

export type ConfigType = [bigint, Address]

export const getAutoSavingAccountTokenConfig = async ({
  client,
  account,
  token,
}: {
  client: PublicClient
  account: Account
  token: Address
}): Promise<ConfigType> => {
  try {
    const config = (await client.readContract({
      address: AUTO_SAVINGS_ADDRESS,
      abi,
      functionName: 'config',
      args: [account.address, token],
    })) as ConfigType

    return config
  } catch {
    throw new Error(`Failed to get config for token ${token}`)
  }
}
