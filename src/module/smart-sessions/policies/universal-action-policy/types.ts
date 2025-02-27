import { Hex } from 'viem'

export enum ParamCondition {
  EQUAL = 0,
  GREATER_THAN = 1,
  LESS_THAN = 2,
  GREATER_THAN_OR_EQUAL = 3,
  LESS_THAN_OR_EQUAL = 4,
  NOT_EQUAL = 5,
  IN_RANGE = 6,
}

// LimitUsage struct
export interface LimitUsage {
  limit: bigint // uint256 in Solidity
  used: bigint // uint256 in Solidity
}

// ParamRule struct
export interface ParamRule {
  condition: ParamCondition
  offset: bigint
  isLimited: boolean
  ref: Hex
  usage: LimitUsage
}

// ParamRules struct with fixed length array
export interface ParamRules {
  length: bigint
  rules: [
    ParamRule,
    ParamRule,
    ParamRule,
    ParamRule,
    ParamRule,
    ParamRule,
    ParamRule,
    ParamRule,
    ParamRule,
    ParamRule,
    ParamRule,
    ParamRule,
    ParamRule,
    ParamRule,
    ParamRule,
    ParamRule,
  ] // ParamRule[16] in Solidity
}

// ActionConfig struct
export interface ActionConfig {
  valueLimitPerUse: bigint // uint256 in Solidity
  paramRules: ParamRules
}
