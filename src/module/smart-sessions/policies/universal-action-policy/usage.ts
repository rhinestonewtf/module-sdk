import { Address, PublicClient } from 'viem'
import { abi } from './abi'
import { ActionConfig } from './types'
import { bigIntToBytes32 } from '../utils'
import { GLOBAL_CONSTANTS } from 'src/constants'

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
    address: GLOBAL_CONSTANTS.UNIVERSAL_ACTION_POLICY_ADDRESS,
    abi: abi,
    functionName: 'actionConfigs',
    args: [bigIntToBytes32(configId), multiplexer, userOpSender],
  })) as ActionConfig
}
