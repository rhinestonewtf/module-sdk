import { Execution } from '../../account'
import {
  encodeFunctionData,
  Address,
  PublicClient,
  getAddress,
  Hex,
  encodeAbiParameters,
  encodePacked,
} from 'viem'
import { abi } from './abi'
import { SENTINEL_ADDRESS } from '../../common/constants'
import { OWNABLE_VALIDATOR_ADDRESS } from './constants'
import { Account } from '../../account'

export const getSetOwnableValidatorThresholdAction = ({
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
    to: OWNABLE_VALIDATOR_ADDRESS,
    target: OWNABLE_VALIDATOR_ADDRESS,
    value: BigInt(0),
    callData: data,
    data,
  }
}

export const getAddOwnableValidatorOwnerAction = async ({
  owner,
  client,
  account,
}: {
  owner: Address
  client: PublicClient
  account: Account
}): Promise<Execution> => {
  const owners = await getOwnableValidatorOwners({ account, client })

  const currentOwnerIndex = owners.findIndex((o: Address) => o === owner)

  if (currentOwnerIndex !== -1) {
    throw new Error('Owner already exists')
  }

  const data = encodeFunctionData({
    functionName: 'addOwner',
    abi,
    args: [owner],
  })

  return {
    to: OWNABLE_VALIDATOR_ADDRESS,
    target: OWNABLE_VALIDATOR_ADDRESS,
    value: BigInt(0),
    callData: data,
    data,
  }
}

export const getRemoveOwnableValidatorOwnerAction = async ({
  client,
  account,
  owner,
}: {
  client: PublicClient
  account: Account
  owner: Address
}): Promise<Execution> => {
  const owners = await getOwnableValidatorOwners({ account, client })
  let prevOwner: Address

  const currentOwnerIndex = owners.findIndex((o: Address) => o === owner)

  if (currentOwnerIndex === -1) {
    throw new Error('Owner not found')
  } else if (currentOwnerIndex === 0) {
    prevOwner = SENTINEL_ADDRESS
  } else {
    prevOwner = getAddress(owners[currentOwnerIndex - 1])
  }

  const data = encodeFunctionData({
    functionName: 'removeOwner',
    abi,
    args: [prevOwner, owner],
  })

  return {
    to: OWNABLE_VALIDATOR_ADDRESS,
    target: OWNABLE_VALIDATOR_ADDRESS,
    value: BigInt(0),
    callData: data,
    data,
  }
}

export const getOwnableValidatorOwners = async ({
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

export const getOwnableValidatorThreshold = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<number> => {
  try {
    const threshold = (await client.readContract({
      address: OWNABLE_VALIDATOR_ADDRESS,
      abi,
      functionName: 'threshold',
      args: [account.address],
    })) as number

    return Number(threshold)
  } catch {
    throw new Error('Failed to get threshold')
  }
}

export const getIsValidSignatureStateless = async ({
  hash,
  signature,
  data,
  client,
}: {
  hash: Hex
  signature: Hex
  data: Hex
  client: PublicClient
}): Promise<number> => {
  try {
    return (await client.readContract({
      address: OWNABLE_VALIDATOR_ADDRESS,
      abi,
      functionName: 'validateSignatureWithData',
      args: [hash, signature, data],
    })) as number
  } catch {
    throw new Error('Failed to check signature')
  }
}

export const encodeValidationData = ({
  threshold,
  owners,
}: {
  threshold: number
  owners: Address[]
}) => {
  return encodeAbiParameters(
    [
      {
        type: 'uint256',
      },
      {
        type: 'address[]',
      },
    ],
    [BigInt(threshold), owners.sort()],
  )
}

export const getOwnableValidatorSignature = ({
  signatures,
}: {
  signatures: Hex[]
}): Hex => {
  let signature = signatures[0]
  for (let i = 1; i < signatures.length; i++) {
    signature = encodePacked(['bytes', 'bytes'], [signature, signatures[i]])
  }
  return signature
}

export const getOwnableValidatorMockSignature = ({
  threshold,
}: {
  threshold: number
}): Hex => {
  const mockSignature =
    '0xe8b94748580ca0b4993c9a1b86b5be851bfc076ff5ce3a1ff65bf16392acfcb800f9b4f1aef1555c7fce5599fffb17e7c635502154a0333ba21f3ae491839af51c' as Hex
  return getOwnableValidatorSignature({
    signatures: Array(threshold).fill(mockSignature),
  })
}
