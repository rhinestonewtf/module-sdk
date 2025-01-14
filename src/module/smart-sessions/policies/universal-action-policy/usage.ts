import { Address, PublicClient } from 'viem'
import { UNIVERSAL_ACTION_POLICY_ADDRESS } from './constants'
import { abi } from './abi'
import { ActionConfig } from './types'

export const getActionConfig = async ({
  client,
  configId,
  multiplexer,
  userOpSender,
}: {
  client: PublicClient
  configId: bigint
  multiplexer: Address
  userOpSender: Address
}) => {
  return (await client.readContract({
    address: UNIVERSAL_ACTION_POLICY_ADDRESS,
    abi: abi,
    functionName: 'actionConfigs',
    args: [configId, multiplexer, userOpSender],
  })) as ActionConfig
}
