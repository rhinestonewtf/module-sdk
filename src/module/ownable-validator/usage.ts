import { Execution } from '../../../src/account'
import {
  encodeFunctionData,
  Address,
  PublicClient,
  getAddress,
  Hex,
} from 'viem'
import { abi } from './abi'
import { SENTINEL_ADDRESS } from '../../common/constants'
import { OWNABLE_VALIDATOR_ADDRESS } from './constants'
import { Account } from '../../account'

export const getSetThresholdExecution = ({
  threshold,
}: {
  threshold: number
}): Execution => {
  return {
    target: OWNABLE_VALIDATOR_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'setThreshold',
      abi,
      args: [BigInt(threshold)],
    }),
  }
}

export const getAddOwnerExecution = ({
  owner,
}: {
  owner: Address
}): Execution => {
  return {
    target: OWNABLE_VALIDATOR_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'addOwner',
      abi,
      args: [owner],
    }),
  }
}

export const getRemoveOwnerExecution = async ({
  client,
  account,
  owner,
}: {
  client: PublicClient
  account: Account
  owner: Address
}): Promise<Execution | Error> => {
  const owners = await getOwners({ account, client })
  let prevOwner: Address

  const currentOwnerIndex = owners.findIndex((o: Address) => o === owner)

  if (currentOwnerIndex === -1) {
    return new Error('Owner not found')
  } else if (currentOwnerIndex === 0) {
    prevOwner = SENTINEL_ADDRESS
  } else {
    prevOwner = getAddress(owners[currentOwnerIndex - 1])
  }

  return {
    target: OWNABLE_VALIDATOR_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'removeOwner',
      abi,
      args: [prevOwner, owner],
    }),
  }
}

export const getOwners = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<Address[]> => {
  try {
    const owners = (await client.readContract({
      address: OWNABLE_VALIDATOR_ADDRESS,
      abi,
      functionName: 'getOwners',
      args: [account.address],
    })) as Address[]

    return owners
  } catch (err) {
    console.error(err)
    return []
  }
}

export const getOwnableValidatorMockSignature = (): Hex => {
  return '0xe8b94748580ca0b4993c9a1b86b5be851bfc076ff5ce3a1ff65bf16392acfcb800f9b4f1aef1555c7fce5599fffb17e7c635502154a0333ba21f3ae491839af51c'
}
