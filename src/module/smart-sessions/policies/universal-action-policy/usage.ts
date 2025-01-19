import { Address, Hex, PublicClient, toHex } from 'viem'
import { UNIVERSAL_ACTION_POLICY_ADDRESS } from './constants'
import { abi } from './abi'
import { ActionConfig } from './types'
import { bigIntToBytes32 } from '../utils'

const testContractAddress: Address =
  '0x081C52B15BE96D6A1C729B0a34c8B4bef3da9238' // TODO: Update the value for UNIVERSAL_ACTION_POLICY_ADDRESS

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
    address: testContractAddress,
    abi: abi,
    functionName: 'actionConfigs',
    args: [bigIntToBytes32(configId), multiplexer, userOpSender],
  })) as ActionConfig
}
