import { Address, PublicClient } from "viem";
import { VALUE_LIMIT_POLICY_ADDRESS } from "./constants";
import { abi } from "./abi";

type ValueLimitConfig = {
    valueLimit: bigint;
    limitUsed: bigint;
}

export const getValueLimitConfig = async ({
  client,
  configId,
  multiplexer,
  userOpSender,
}: {
  client: PublicClient;
  configId: bigint; 
  multiplexer: Address; 
  userOpSender: Address;
}) => {
    return (await client.readContract({
      address: VALUE_LIMIT_POLICY_ADDRESS as Address,
      abi: abi,
      functionName: "valueLimitConfigs",
      args: [configId, multiplexer, userOpSender],
    })) as ValueLimitConfig
};
