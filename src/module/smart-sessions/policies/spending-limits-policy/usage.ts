import { Address, Hex, PublicClient } from 'viem'
import { abi } from './abi'
import { SpendingLimitPolicyData } from './types'
import { GLOBAL_CONSTANTS } from '../../../../constants'

export const getPolicyData = async ({
  client,
  configId,
  multiplexer,
  token,
  userOpSender,
}: {
  client: PublicClient
  configId: Hex
  multiplexer: Address
  token: Address
  userOpSender: Address
}) => {
  return (await client.readContract({
    address: GLOBAL_CONSTANTS.SPENDING_LIMITS_POLICY_ADDRESS,
    abi: abi,
    functionName: 'getPolicyData',
    args: [configId, multiplexer, token, userOpSender],
  })) as SpendingLimitPolicyData
}
