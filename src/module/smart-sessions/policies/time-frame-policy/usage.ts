import { Address, PublicClient } from "viem";
import { TIME_FRAME_POLICY_ADDRESS } from "./constants";
import { abi } from "./abi";

export const getTimeFramePolicy = async ({
    client,
    configId,
    multiplexer,
    smartAccount,
}: {
  client: PublicClient;
  configId: bigint; 
  multiplexer: Address;
  smartAccount: Address; 
}) => {
    return (await client.readContract({
      address: TIME_FRAME_POLICY_ADDRESS,
      abi: abi,
      functionName: 'getTimeFrameConfig',
      args: [configId, multiplexer, smartAccount],
    })) as bigint;
};