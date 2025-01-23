import { Address, Hex, PublicClient } from 'viem'
import { abi } from './abi'
import { UsageLimitConfig } from './types'
import { GLOBAL_CONSTANTS } from '../../../../constants'

export const getUsageLimitConfig = async ({
  client,
  configId,
  multiplexer,
  smartAccount,
}: {
  client: PublicClient
  configId: Hex
  multiplexer: Address
  smartAccount: Address
}) => {
  return (await client.readContract({
    address: GLOBAL_CONSTANTS.USAGE_LIMIT_POLICY_ADDRESS as Address,
    abi: abi,
    functionName: 'getUsageLimit',
    args: [configId, multiplexer, smartAccount],
  })) as UsageLimitConfig
}
