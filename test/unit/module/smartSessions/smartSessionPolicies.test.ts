import {
  getTimeFramePolicy,
  getUsageLimitPolicy,
  getValueLimitPolicy,
} from 'src/module'
import { getSpendingLimitsPolicy } from 'src/module/smart-sessions/policies/spending-limits-policy'
import { getPolicyData } from 'src/module/smart-sessions/policies/spending-limits-policy/usage'
import { getSudoPolicy } from 'src/module/smart-sessions/policies/sudo-policy'
import { getTimeFramePolicyData } from 'src/module/smart-sessions/policies/time-frame-policy/usage'
import {
  getUniversalActionPolicy,
  UNIVERSAL_ACTION_POLICY_ADDRESS,
} from 'src/module/smart-sessions/policies/universal-action-policy'
import {
  ActionConfig,
  ParamCondition,
} from 'src/module/smart-sessions/policies/universal-action-policy/types'
import { getActionConfig } from 'src/module/smart-sessions/policies/universal-action-policy/usage'
import { getUsageLimitConfig } from 'src/module/smart-sessions/policies/usage-limit-policy/usage'
import { getValueLimitConfig } from 'src/module/smart-sessions/policies/value-limit-policy/usage'
import { createPublicClient, http, PublicClient, zeroAddress } from 'viem'
import { sepolia } from 'viem/chains'

describe('Smart Sessions Polices', () => {
  let client: PublicClient
  beforeAll(() => {
    client = createPublicClient({
      chain: sepolia,
      transport: http('https://rpc.sepolia.ethpandaops.io'),
    })
    //client = getPublicClient(sepolia) //default RPC url timeout when testing
  })

  // -----------------------
  // Universal Action Policy
  // -----------------------
  describe('Universal Action Policy', () => {
    it.skip('should get install universal action policy', async () => {
      //skipping as it used the abi for the old contract
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

    it('should get actionConfigs', async () => {
      const result = await getActionConfig({
        client: client,
        configId: BigInt(1),
        multiplexer: zeroAddress,
        userOpSender: zeroAddress,
      })
      expect(result).toBeDefined()
    })
  })

  // -----------------------
  // Sudo Action Policy
  // -----------------------
  describe('Sudo Action Policy', () => {
    it('should get install sudo action policy', async () => {
      const installSudoActionPolicy = getSudoPolicy()
      expect(installSudoActionPolicy.address).toBeDefined()
      expect(installSudoActionPolicy.initData).toEqual('0x')
    })
  })

  // -----------------------
  // Spending Limit Policy
  // -----------------------
  describe('Spending Limit Policy', () => {
    it('should get install spending limit policy', async () => {
      const installSpendingLimitPolicy = getSpendingLimitsPolicy([
        { limit: BigInt(1000), token: zeroAddress },
      ])

      expect(installSpendingLimitPolicy.address).toBeDefined()
      expect(installSpendingLimitPolicy.initData).toBeDefined()
    })

    it.skip('getPolicyData Test', async () => {
      // skipping due to invalid token address
      const result = await getPolicyData({
        client: client,
        configId: BigInt(1),
        multiplexer: zeroAddress,
        token: zeroAddress,
        userOpSender: zeroAddress,
      })
      expect(result).toBeDefined()
    })
  })

  // -----------------------
  // Time frame policy
  // -----------------------
  describe('Time Frame Policy', () => {
    it('should get install time frame policy', async () => {
      const installTimeFramePolicy = getTimeFramePolicy({
        validAfter: Date.now(),
        validUntil: Date.now() + 60 * 60 * 24,
      })

      expect(installTimeFramePolicy.address).toBeDefined()
      expect(installTimeFramePolicy.initData).toBeDefined()
    })

    it('getTimeFrameConfig Test', async () => {
      const result = await getTimeFramePolicyData({
        client: client,
        configId: BigInt(1),
        multiplexer: zeroAddress,
        smartAccount: zeroAddress,
      })
      expect(result).toBeDefined()
    })
  })

  // -----------------------
  // Usage Limit policy
  // -----------------------
  describe('Usage Limit Policy', () => {
    it('should get install spending limit policy', async () => {
      const installUsageLimitPolicy = getUsageLimitPolicy({
        limit: BigInt(1000),
      })

      expect(installUsageLimitPolicy.address).toBeDefined()
      expect(installUsageLimitPolicy.initData).toBeDefined()
    })

    it('getUsageLimit Test', async () => {
      const result = await getUsageLimitConfig({
        client: client,
        configId: BigInt(1),
        multiplexer: zeroAddress,
        smartAccount: zeroAddress,
      })
      expect(result).toBeDefined()
    })
  })

  // -----------------------
  // Value Limit policy
  // -----------------------
  describe('Value Limit Policy', () => {
    it('should get install value limit policy', async () => {
      const installValueLimitPolicy = getValueLimitPolicy({
        limit: BigInt(1000),
      })

      expect(installValueLimitPolicy.address).toBeDefined()
      expect(installValueLimitPolicy.initData).toBeDefined()
    })

    it('getValueLimit Test', async () => {
      const result = await getValueLimitConfig({
        client: client,
        configId: BigInt(1),
        msgSender: zeroAddress,
        userOpSender: zeroAddress,
      })
      expect(result).toBeDefined()
    })
  })
})
