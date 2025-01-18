import { Address, Hex, PublicClient, toHex } from 'viem'
import { SPENDING_LIMITS_POLICY_ADDRESS } from './constants'
import { abi } from './abi'
import { SpendingLimitPolicyData } from './types'

export const getPolicyData = async ({
  client,
  configId,
  multiplexer,
  token,
  userOpSender,
}: {
  client: PublicClient
  configId: bigint
  multiplexer: Address
  token: Address
  userOpSender: Address
}) => {
  return (await client.readContract({
    address: SPENDING_LIMITS_POLICY_ADDRESS,
    abi: abi,
    functionName: 'getPolicyData',
    args: [
      toHex(configId, { size: 32 }) as Hex,
      multiplexer,
      token,
      userOpSender,
    ],
  })) as SpendingLimitPolicyData
}
