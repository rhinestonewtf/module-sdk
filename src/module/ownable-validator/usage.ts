import { Execution } from '../../../src/account'
import { encodeFunctionData, Address, PublicClient, getAddress } from 'viem'
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
