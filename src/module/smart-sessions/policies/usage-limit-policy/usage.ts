import { Address, PublicClient } from 'viem'
import { USAGE_LIMIT_POLICY_ADDRESS } from './constants'
import { abi } from './abi'
import { UsageLimitConfig } from './types'
import { bigIntToBytes32 } from '../utils'

export const getUsageLimitConfig = async ({
  client,
  configId,
  multiplexer,
  smartAccount,
}: {
  client: PublicClient
  configId: bigint
  multiplexer: Address
  smartAccount: Address
}) => {
  return (await client.readContract({
    address: USAGE_LIMIT_POLICY_ADDRESS as Address,
    abi: abi,
    functionName: 'getUsageLimit',
    args: [bigIntToBytes32(configId), multiplexer, smartAccount],
  })) as UsageLimitConfig
}
