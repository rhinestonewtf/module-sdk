import { Address, PublicClient } from "viem";
import { UNIVERSAL_ACTION_POLICY_ADDRESS } from "./constants";
import { abi } from "./abi";

enum ParamCondition {
  EQUAL = "EQUAL",
  GREATER_THAN = "GREATER_THAN",
  LESS_THAN = "LESS_THAN",
  GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL",
  LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL",
  NOT_EQUAL = "NOT_EQUAL",
  IN_RANGE = "IN_RANGE",
}

type LimitUsage = {
  limit: number;
  used: number;
}

type ParamRule = {
  condition: ParamCondition;
  offset: number;
  isLimited: boolean;
  ref: string; 
  usage: LimitUsage;
}

type ParamRules = {
  length: number;
  rules: ParamRule[]; 
}

type ActionConfig = {
  valueLimitPerUse: number;
  paramRules: ParamRules;
}

export const getActionConfig = async ({
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
      address: UNIVERSAL_ACTION_POLICY_ADDRESS,
      abi: abi,
      functionName: 'actionConfigs',
      args: [configId, multiplexer, userOpSender],
    })) as ActionConfig;
};
