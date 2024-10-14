import { MAX_RULES, UNIVERSAL_ACTION_POLICY_ADDRESS } from './constants'
import { Policy } from '../types'
import { encodeAbiParameters } from 'viem'
import { abi } from './abi'
import { ActionConfig } from './types'

export const getUniversalActionPolicy = (
  actionConfig: ActionConfig,
): Policy => {
  if (actionConfig.paramRules.rules.length > MAX_RULES) {
    throw new Error(`Max number of rules is ${MAX_RULES}`)
  }

  return {
    policy: UNIVERSAL_ACTION_POLICY_ADDRESS,
    address: UNIVERSAL_ACTION_POLICY_ADDRESS,
    initData: encodeAbiParameters(abi, [
      {
        valueLimitPerUse: actionConfig.valueLimitPerUse,
        paramRules: {
          length: actionConfig.paramRules.length,
          rules: actionConfig.paramRules.rules,
        },
      },
    ]),
  }
}
