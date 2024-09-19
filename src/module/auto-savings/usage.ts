import { Address, encodeFunctionData, getAddress, PublicClient } from 'viem'
import { AUTO_SAVINGS_ADDRESS } from './constants'
import { abi } from './abi'
import { Execution } from '../../account'
import { SENTINEL_ADDRESS } from '../../common/constants'
import { Account } from '../../account'

type Params = {
  token: Address
  config: {
    percentage: number
    vault: Address
    sqrtPriceLimitX96: bigint
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
      return new Error('Token not found')
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
    return new Error(`Failed to delete config for token ${token}`)
  }
}

export const getAutoSaveAction = async ({
  token,
  amountReceived,
}: {
  token: Address
  amountReceived: number
}): Promise<Execution> => {
  try {
    return {
      target: AUTO_SAVINGS_ADDRESS,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: 'autoSave',
        abi,
        args: [token, BigInt(amountReceived)],
      }),
    }
  } catch {
    return new Error(`Failed to create autosave action for token ${token}`)
  }
}

export type ConfigType = [number, Address, number]

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
    return new Error(`Failed to get config for token ${token}`)
  }
}
