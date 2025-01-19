import { Address, PublicClient } from 'viem'
import { VALUE_LIMIT_POLICY_ADDRESS } from './constants'
import { abi } from './abi'
import { ValueLimitConfig } from './types'
import { bigIntToBytes32 } from '../utils'

export const getValueLimitConfig = async ({
  client,
  configId,
  msgSender,
  userOpSender,
}: {
  client: PublicClient
  configId: bigint
  msgSender: Address
  userOpSender: Address
}) => {
  return (await client.readContract({
    address: VALUE_LIMIT_POLICY_ADDRESS as Address,
    abi: abi,
    functionName: 'getValueLimit',
    args: [bigIntToBytes32(configId), msgSender, userOpSender],
  })) as ValueLimitConfig
}
