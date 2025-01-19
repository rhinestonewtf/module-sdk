import { Address, Hex, PublicClient, toHex } from 'viem'
import { TIME_FRAME_POLICY_ADDRESS } from './constants'
import { abi } from './abi'
import { TimeFrameConfig } from './types'
import { bigIntToBytes32 } from '../utils'

export const getTimeFramePolicyData = async ({
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
    address: TIME_FRAME_POLICY_ADDRESS,
    abi: abi,
    functionName: 'getTimeFrameConfig',
    args: [bigIntToBytes32(configId), multiplexer, smartAccount],
  })) as TimeFrameConfig
}
