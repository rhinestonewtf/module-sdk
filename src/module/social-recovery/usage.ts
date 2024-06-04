import { SOCIAL_RECOVERY_ADDRESS } from './constants'
import { SENTINEL_ADDRESS } from '../../common/constants'
import { Execution } from '../../account/types'
import { Address, encodeFunctionData, getAddress, PublicClient } from 'viem'
import { Account } from '../../account/types'
import { abi } from './abi'

export const getSetThresholdAction = ({
  threshold,
}: {
  threshold: number
}): Execution => {
  return {
    target: SOCIAL_RECOVERY_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'setThreshold',
      abi,
      args: [BigInt(threshold)],
    }),
  }
}

export const getAddGuardianAction = ({
  guardian,
}: {
  guardian: Address
}): Execution => {
  return {
    target: SOCIAL_RECOVERY_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'addGuardian',
      abi,
      args: [guardian],
    }),
  }
}

export const getRemoveGuardianAction = async ({
  client,
  account,
  guardian,
}: {
  client: PublicClient
  account: Account
  guardian: Address
}): Promise<Execution | Error> => {
  const guardians = await getGuardians({ account, client })
  let prevGuardian: Address

  const currentGuardianIndex = guardians.findIndex((g) => g === guardian)

  if (currentGuardianIndex === -1) {
    return new Error('Guardian not found')
  } else if (currentGuardianIndex === 0) {
    prevGuardian = SENTINEL_ADDRESS
  } else {
    prevGuardian = getAddress(guardians[currentGuardianIndex - 1])
  }

  return {
    target: SOCIAL_RECOVERY_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'removeGuardian',
      abi,
      args: [prevGuardian, guardian],
    }),
  }
}

export const getGuardians = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<Address[]> => {
  try {
    const guardians = (await client.readContract({
      address: SOCIAL_RECOVERY_ADDRESS,
      abi,
      functionName: 'getGuardians',
      args: [account.address],
    })) as Address[]

    return guardians
  } catch (err) {
    console.error(err)
    return []
  }
}
