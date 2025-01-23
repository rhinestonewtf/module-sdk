import { Address, Hex, PublicClient } from 'viem'
import { abi } from './abi'
import { TimeFrameConfig } from './types'
import { GLOBAL_CONSTANTS } from '../../../../constants'

export const getTimeFramePolicyData = async ({
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
    address: GLOBAL_CONSTANTS.TIME_FRAME_POLICY_ADDRESS,
    abi: abi,
    functionName: 'getTimeFrameConfig',
    args: [configId, multiplexer, smartAccount],
  })) as TimeFrameConfig
}
