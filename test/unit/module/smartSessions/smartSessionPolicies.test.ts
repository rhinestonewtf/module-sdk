import { getValueLimitPolicy } from 'src/module/smart-sessions/policies/value-limit-policy'
import { getUsageLimitPolicy } from 'src/module/smart-sessions/policies/usage-limit-policy'
import { getSpendingLimitsPolicy } from 'src/module/smart-sessions/policies/spending-limits-policy'
import { getSudoPolicy } from 'src/module/smart-sessions/policies/sudo-policy'
import {
  getUniversalActionPolicy,
  UNIVERSAL_ACTION_POLICY_ADDRESS,
} from 'src/module/smart-sessions/policies/universal-action-policy'
import {
  ActionConfig,
  ParamCondition,
} from 'src/module/smart-sessions/policies/universal-action-policy/types'
import { zeroAddress } from 'viem'

describe('Smart Sessions Polices', () => {
  // -----------------------
  // Universal Action Policy
  // -----------------------
  it('should get install universal action policy', async () => {
    // Setup
    const actionConfigData: ActionConfig = {
      valueLimitPerUse: BigInt(1000),
      paramRules: {
        length: 2,
        rules: new Array(16).fill({
          condition: ParamCondition.EQUAL,
          offset: 0,
          isLimited: true,
          ref: '0x00000000000000000000000000000000000000000000000000000000000003e8', // 1000 in bytes32
          usage: {
            limit: BigInt(1000),
            used: BigInt(10),
          },
        }),
      },
    }
    const installUniversalPolicy = getUniversalActionPolicy(actionConfigData)

    expect(installUniversalPolicy.address).toEqual(
      UNIVERSAL_ACTION_POLICY_ADDRESS,
    )
    expect(installUniversalPolicy.initData).toBeDefined()
  })

  // -----------------------
  // Sudo Action Policy
  // -----------------------
  it('should get install sudo action policy', async () => {
    const installSudoActionPolicy = getSudoPolicy()
    expect(installSudoActionPolicy.address).toBeDefined()
    expect(installSudoActionPolicy.initData).toEqual('0x')
  })

  // -----------------------
  // Spending Limit Policy
  // -----------------------
  it('should get install spending limit policy', async () => {
    const installSpendingLimitPolicy = getSpendingLimitsPolicy([
      { limit: BigInt(1000), token: zeroAddress },
    ])

    expect(installSpendingLimitPolicy.address).toBeDefined()
    expect(installSpendingLimitPolicy.initData).toBeDefined()
  })

  // -----------------------
  // Usage Limit policy
  // -----------------------
  it('should get install spending limit policy', async () => {
    const installUsageLimitPolicy = getUsageLimitPolicy({
      limit: BigInt(1000),
    })

    expect(installUsageLimitPolicy.address).toBeDefined()
    expect(installUsageLimitPolicy.initData).toBeDefined()
  })
  // -----------------------
  // Value Limit policy
  // -----------------------
  it('should get install spending limit policy', async () => {
    const installValueLimitPolicy = getValueLimitPolicy({
      valueLimit: BigInt(1000),
      limitUsed: BigInt(0),
      
    })

    expect(installValueLimitPolicy.address).toBeDefined()
    expect(installValueLimitPolicy.initData).toBeDefined()
  })  
  
})
