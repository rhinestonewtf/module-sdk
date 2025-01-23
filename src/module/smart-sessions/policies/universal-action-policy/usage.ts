import { Address, Hex, PublicClient } from 'viem'
import { abi } from './abi'
import { ActionConfig } from './types'
import { GLOBAL_CONSTANTS } from '../../../../constants'

export const getActionConfig = async ({
  client,
  configId,
  multiplexer,
  userOpSender,
}: {
  client: PublicClient
  configId: Hex
  multiplexer: Address
  userOpSender: Address
}) => {
  return (await client.readContract({
    address: GLOBAL_CONSTANTS.UNIVERSAL_ACTION_POLICY_ADDRESS,
    abi: abi,
    functionName: 'actionConfigs',
    args: [configId, multiplexer, userOpSender],
  })) as ActionConfig
}
