import {
  Address,
  encodeFunctionData,
  getAddress,
  Hex,
  PublicClient,
} from 'viem'
import {
  COLD_STORAGE_HOOK_ADDRESS,
  COLD_STORAGE_FLASHLOAN_ADDRESS,
} from './constants'
import { abi } from './abi'
import { abi as flashloanAbi } from './flashloanAbi'
import { Execution } from '../../account'
import { Account } from '../../account'
import { moduleTypeIds } from '../types'
import { SENTINEL_ADDRESS } from '../../common/constants'

type Params = {
  waitPeriod: number
}

export const getColdStorageSetWaitPeriodAction = ({
  waitPeriod,
}: Params): Execution => {
  const data = encodeFunctionData({
    functionName: 'setWaitPeriod',
    abi,
    args: [BigInt(waitPeriod)],
  })

  return {
    to: COLD_STORAGE_HOOK_ADDRESS,
    target: COLD_STORAGE_HOOK_ADDRESS,
    value: BigInt(0),
    callData: data,
    data,
  }
}

export const getColdStorageExecutionTime = async ({
  account,
  client,
  executionHash,
}: {
  account: Account
  client: PublicClient
  executionHash: Hex
}): Promise<Number> => {
  try {
    const executionTimestamp = (await client.readContract({
      address: COLD_STORAGE_HOOK_ADDRESS,
      abi,
      functionName: 'checkHash',
      args: [account.address, executionHash],
    })) as Hex

    return Number(executionTimestamp)
  } catch (err) {
    console.error(err)
    throw new Error(
      `Failed to get execution time for account ${account.address} for execution ${executionHash}`,
    )
  }
}

type RequestTimelockedExecutionParams = {
  execution: Execution
  additionalWait: number
}

export const getRequestTimelockedExecution = ({
  execution,
  additionalWait,
}: RequestTimelockedExecutionParams): Execution => {
  const data = encodeFunctionData({
    functionName: 'requestTimelockedExecution',
    abi,
    args: [execution, additionalWait],
  })

  return {
    to: COLD_STORAGE_HOOK_ADDRESS,
    target: COLD_STORAGE_HOOK_ADDRESS,
    value: BigInt(0),
    callData: data,
    data,
  }
}

type RequestTimelockedModuleConfigParams = {
  moduleTypeId: (typeof moduleTypeIds)[keyof typeof moduleTypeIds]
  module: Address
  data: Hex
  isInstall: boolean
  additionalWait: number
}

export const getRequestTimelockedModuleConfigExecution = ({
  moduleTypeId,
  module,
  data,
  isInstall,
  additionalWait,
}: RequestTimelockedModuleConfigParams): Execution => {
  const callData = encodeFunctionData({
    functionName: 'requestTimelockedModuleConfig',
    abi,
    args: [
      BigInt(moduleTypeId),
      module,
      data,
      isInstall,
      BigInt(additionalWait),
    ],
  })

  return {
    to: COLD_STORAGE_HOOK_ADDRESS,
    target: COLD_STORAGE_HOOK_ADDRESS,
    value: BigInt(0),
    callData: callData,
    data: callData,
  }
}

// -----------------
// Flashloan actions
// -----------------

export const getFlashloanAddAddressAction = ({
  addressToAdd,
}: {
  addressToAdd: Address
}): Execution => {
  const data = encodeFunctionData({
    functionName: 'addAddress',
    abi: flashloanAbi,
    args: [addressToAdd],
  })

  return {
    to: COLD_STORAGE_FLASHLOAN_ADDRESS,
    target: COLD_STORAGE_FLASHLOAN_ADDRESS,
    value: BigInt(0),
    callData: data,
    data,
  }
}

export const getFlashloanRemoveAddressAction = async ({
  client,
  account,
  addressToRemove,
}: {
  client: PublicClient
  account: Account
  addressToRemove: Address
}): Promise<Execution> => {
  const whitelistAddresses = await getFlashloanWhitelist({ account, client })
  let prevAddress: Address

  const currentAddressIndex = whitelistAddresses.findIndex(
    (a) => a === addressToRemove,
  )

  if (currentAddressIndex === -1) {
    throw new Error('Address not found')
  } else if (currentAddressIndex === 0) {
    prevAddress = SENTINEL_ADDRESS
  } else {
    prevAddress = getAddress(whitelistAddresses[currentAddressIndex - 1])
  }

  const data = encodeFunctionData({
    functionName: 'removeAddress',
    abi: flashloanAbi,
    args: [prevAddress, addressToRemove],
  })

  return {
    to: COLD_STORAGE_FLASHLOAN_ADDRESS,
    target: COLD_STORAGE_FLASHLOAN_ADDRESS,
    value: BigInt(0),
    callData: data,
    data,
  }
}

export const getFlashloanWhitelist = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<Address[]> => {
  try {
    const whitelistAddresses = (await client.readContract({
      address: COLD_STORAGE_FLASHLOAN_ADDRESS,
      abi: flashloanAbi,
      functionName: 'getWhitelist',
      args: [account.address],
    })) as Address[]

    return whitelistAddresses
  } catch (err) {
    console.error(err)
    return []
  }
}
