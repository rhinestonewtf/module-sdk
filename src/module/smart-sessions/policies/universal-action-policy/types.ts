import { Hex } from 'viem'

export type ActionConfig = {
  valueLimitPerUse: bigint
  paramRules: ParamRules
}

export type ParamRules = {
  length: number
  rules: ParamRule[]
}

export type ParamRule = {
  condition: ParamCondition
  offset: number
  isLimited: boolean
  ref: Hex
  usage: LimitUsage
}

export type LimitUsage = {
  limit: bigint
  used: bigint
}

export enum ParamCondition {
  EQUAL,
  GREATER_THAN,
  LESS_THAN,
  GREATER_THAN_OR_EQUAL,
  LESS_THAN_OR_EQUAL,
  NOT_EQUAL,
}
