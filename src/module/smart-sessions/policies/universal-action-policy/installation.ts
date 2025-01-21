import { MAX_RULES } from './constants'
import { Policy } from '../types'
import { Abi, encodeAbiParameters } from 'viem'
import { abi } from './abi'
import { ActionConfig } from './types'
import { GLOBAL_CONSTANTS } from 'src/constants'

export const getUniversalActionPolicy = (
  actionConfig: ActionConfig,
): Policy => {
  if (actionConfig.paramRules.rules.length > MAX_RULES) {
    throw new Error(`Max number of rules is ${MAX_RULES}`)
  }

  return {
    policy: GLOBAL_CONSTANTS.UNIVERSAL_ACTION_POLICY_ADDRESS,
    address: GLOBAL_CONSTANTS.UNIVERSAL_ACTION_POLICY_ADDRESS,
    initData: encodeAbiParameters(abi as Abi, [
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
