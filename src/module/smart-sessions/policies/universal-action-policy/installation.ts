import { MAX_RULES } from './constants'
import { Policy } from '../types'
import { encodeAbiParameters } from 'viem'
import { abi } from './abi'
import { ActionConfig } from './types'
import { GLOBAL_CONSTANTS } from '../../../../constants'

export const getUniversalActionPolicy = (
  actionConfig: ActionConfig,
): Policy => {
  if (actionConfig.paramRules.rules.length > MAX_RULES) {
    throw new Error(`Max number of rules is ${MAX_RULES}`)
  }

  return {
    policy: GLOBAL_CONSTANTS.UNIVERSAL_ACTION_POLICY_ADDRESS,
    address: GLOBAL_CONSTANTS.UNIVERSAL_ACTION_POLICY_ADDRESS,
    initData: encodeAbiParameters(
      [
        {
          components: [
            {
              name: 'valueLimitPerUse',
              type: 'uint256',
            },
            {
              components: [
                {
                  name: 'length',
                  type: 'uint256',
                },
                {
                  components: [
                    {
                      name: 'condition',
                      type: 'uint8',
                    },
                    {
                      name: 'offset',
                      type: 'uint64',
                    },
                    {
                      name: 'isLimited',
                      type: 'bool',
                    },
                    {
                      name: 'ref',
                      type: 'bytes32',
                    },
                    {
                      components: [
                        {
                          name: 'limit',
                          type: 'uint256',
                        },
                        {
                          name: 'used',
                          type: 'uint256',
                        },
                      ],
                      name: 'usage',
                      type: 'tuple',
                    },
                  ],
                  name: 'rules',
                  type: 'tuple[16]',
                },
              ],
              name: 'paramRules',
              type: 'tuple',
            },
          ],
          name: 'ActionConfig',
          type: 'tuple',
        },
      ],
      [actionConfig],
    ),
  }
}
