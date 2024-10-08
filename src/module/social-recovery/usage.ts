import { SOCIAL_RECOVERY_ADDRESS } from './constants'
import { SENTINEL_ADDRESS } from '../../common/constants'
import { Execution } from '../../account/types'
import {
  Address,
  encodeFunctionData,
  encodePacked,
  getAddress,
  Hex,
  PublicClient,
} from 'viem'
import { Account } from '../../account/types'
import { abi } from './abi'

export const getSetSocialRecoveryThresholdAction = ({
  threshold,
}: {
  threshold: number
}): Execution => {
  const data = encodeFunctionData({
    functionName: 'setThreshold',
    abi,
    args: [BigInt(threshold)],
  })

  return {
    to: SOCIAL_RECOVERY_ADDRESS,
    target: SOCIAL_RECOVERY_ADDRESS,
    value: BigInt(0),
    callData: data,
    data,
  }
}

export const getAddSocialRecoveryGuardianAction = ({
  guardian,
}: {
  guardian: Address
}): Execution => {
  const data = encodeFunctionData({
    functionName: 'addGuardian',
    abi,
    args: [guardian],
  })

  return {
    to: SOCIAL_RECOVERY_ADDRESS,
    target: SOCIAL_RECOVERY_ADDRESS,
    value: BigInt(0),
    callData: data,
    data,
  }
}

export const getRemoveSocialRecoveryGuardianAction = async ({
  client,
  account,
  guardian,
}: {
  client: PublicClient
  account: Account
  guardian: Address
}): Promise<Execution> => {
  const guardians = await getSocialRecoveryGuardians({ account, client })
  let prevGuardian: Address

  const currentGuardianIndex = guardians.findIndex((g) => g === guardian)

  if (currentGuardianIndex === -1) {
    throw new Error('Guardian not found')
  } else if (currentGuardianIndex === 0) {
    prevGuardian = SENTINEL_ADDRESS
  } else {
    prevGuardian = getAddress(guardians[currentGuardianIndex - 1])
  }

  const data = encodeFunctionData({
    functionName: 'removeGuardian',
    abi,
    args: [prevGuardian, guardian],
  })

  return {
    to: SOCIAL_RECOVERY_ADDRESS,
    target: SOCIAL_RECOVERY_ADDRESS,
    value: BigInt(0),
    callData: data,
    data,
  }
}

export const getSocialRecoveryGuardians = async ({
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

export const getSocialRecoveryMockSignature = ({
  threshold,
}: {
  threshold: number
}): Hex => {
  const mockSignature =
    '0xe8b94748580ca0b4993c9a1b86b5be851bfc076ff5ce3a1ff65bf16392acfcb800f9b4f1aef1555c7fce5599fffb17e7c635502154a0333ba21f3ae491839af51c'
  return encodePacked(
    Array(threshold).fill('bytes'),
    Array(threshold).fill(mockSignature),
  )
}
