import { Address, encodeFunctionData, PublicClient } from 'viem'
import { getRegistryModules } from '../../common/queries'
import { Execution } from '../../account/types'
import { REGISTRY_ADDRESS } from './constants'
import { abi } from './abi'

export const fetchRegistryModules = ({ client }: { client: PublicClient }) =>
  getRegistryModules({ client })

export const getTrustAttestersAction = ({
  attesters,
  threshold,
}: {
  attesters: Address[]
  threshold: number
}): Execution => {
  const data = encodeFunctionData({
    functionName: 'trustAttesters',
    abi,
    args: [threshold, attesters],
  })

  return {
    to: REGISTRY_ADDRESS,
    target: REGISTRY_ADDRESS,
    value: BigInt(0),
    callData: data,
    data,
  }
}

export const findTrustedAttesters = async ({
  client,
  accountAddress,
}: {
  client: PublicClient
  accountAddress: Address
}) => {
  return (await client.readContract({
    address: REGISTRY_ADDRESS,
    abi,
    functionName: 'findTrustedAttesters',
    args: [accountAddress],
  })) as Address[]
}

