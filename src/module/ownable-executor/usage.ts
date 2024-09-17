import { Execution } from '../../account'
import {
  encodeFunctionData,
  Address,
  PublicClient,
  getAddress,
  encodePacked,
  encodeAbiParameters,
} from 'viem'
import { abi } from './abi'
import { SENTINEL_ADDRESS } from '../../common/constants'
import { OWNABLE_EXECUTOR_ADDRESS } from './constants'
import { Account } from '../../account'

export const getAddOwnableExecutorOwnerAction = async ({
  owner,
  client,
  account,
}: {
  owner: Address
  client: PublicClient
  account: Account
}): Promise<Execution> => {
  const owners = await getOwnableExecutorOwners({ account, client })

  const currentOwnerIndex = owners.findIndex((o: Address) => o === owner)

  if (currentOwnerIndex !== -1) {
    throw new Error('Owner already exists')
  }

  return {
    target: OWNABLE_EXECUTOR_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'addOwner',
      abi,
      args: [owner],
    }),
  }
}

export const getRemoveOwnableExecutorOwnerAction = async ({
  client,
  account,
  owner,
}: {
  client: PublicClient
  account: Account
  owner: Address
}): Promise<Execution | Error> => {
  const owners = await getOwnableExecutorOwners({ account, client })
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
    target: OWNABLE_EXECUTOR_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'removeOwner',
      abi,
      args: [prevOwner, owner],
    }),
  }
}

export const getOwnableExecutorOwners = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<Address[]> => {
  try {
    const owners = (await client.readContract({
      address: OWNABLE_EXECUTOR_ADDRESS,
      abi,
      functionName: 'getOwners',
      args: [account.address],
    })) as Address[]

    return owners
  } catch (err) {
    return []
  }
}

export const getExecuteOnOwnedAccountAction = ({
  ownedAccount,
  execution,
}: {
  ownedAccount: Address
  execution: Execution
}): Execution => {
  return {
    target: OWNABLE_EXECUTOR_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'executeOnOwnedAccount',
      abi,
      args: [
        ownedAccount,
        encodePacked(
          ['address', 'uint256', 'bytes'],
          [
            execution.target,
            BigInt(Number(execution.value)),
            execution.callData,
          ],
        ),
      ],
    }),
  }
}

export const getExecuteBatchOnOwnedAccountAction = ({
  ownedAccount,
  executions,
}: {
  ownedAccount: Address
  executions: Execution[]
}): Execution => {
  return {
    target: OWNABLE_EXECUTOR_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'executeBatchOnOwnedAccount',
      abi,
      args: [
        ownedAccount,
        encodeAbiParameters(
          [
            {
              components: [
                {
                  name: 'target',
                  type: 'address',
                },
                {
                  name: 'value',
                  type: 'uint256',
                },
                {
                  name: 'callData',
                  type: 'bytes',
                },
              ],
              name: 'Execution',
              type: 'tuple[]',
            },
          ],
          // @ts-ignore
          [executions],
        ),
      ],
    }),
  }
}
