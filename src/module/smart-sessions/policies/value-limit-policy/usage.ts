import { Address, Hex, PublicClient } from 'viem'
import { abi } from './abi'
import { ValueLimitConfig } from './types'
import { GLOBAL_CONSTANTS } from '../../../../constants'

export const getValueLimitConfig = async ({
  client,
  configId,
  msgSender,
  userOpSender,
}: {
  client: PublicClient
  configId: Hex
  msgSender: Address
  userOpSender: Address
}) => {
  return (await client.readContract({
    address: GLOBAL_CONSTANTS.VALUE_LIMIT_POLICY_ADDRESS as Address,
    abi: abi,
    functionName: 'getValueLimit',
    args: [configId, msgSender, userOpSender],
  })) as ValueLimitConfig
}
