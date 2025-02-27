import {
  getTimeFramePolicy,
  getUsageLimitPolicy,
  getValueLimitPolicy,
} from 'src/module'
import { getSpendingLimitsPolicy } from 'src/module/smart-sessions/policies/spending-limits-policy'
import { getPolicyData } from 'src/module/smart-sessions/policies/spending-limits-policy/usage'
import { getSudoPolicy } from 'src/module/smart-sessions/policies/sudo-policy'
import { getTimeFramePolicyData } from 'src/module/smart-sessions/policies/time-frame-policy/usage'
import { getUniversalActionPolicy } from 'src/module/smart-sessions/policies/universal-action-policy'
import {
  ActionConfig,
  ParamCondition,
  ParamRule,
} from 'src/module/smart-sessions/policies/universal-action-policy/types'
import { getActionConfig } from 'src/module/smart-sessions/policies/universal-action-policy/usage'
import { getUsageLimitConfig } from 'src/module/smart-sessions/policies/usage-limit-policy/usage'
import { getValueLimitConfig } from 'src/module/smart-sessions/policies/value-limit-policy/usage'
import {
  createPublicClient,
  Hex,
  http,
  PublicClient,
  toHex,
  zeroAddress,
} from 'viem'
import { sepolia } from 'viem/chains'
import { GLOBAL_CONSTANTS } from 'src/constants'

describe('Smart Sessions Polices', () => {
  let client: PublicClient
  beforeAll(() => {
    client = createPublicClient({
      chain: sepolia,
      transport: http('https://rpc.sepolia.ethpandaops.io'),
    })
  })

  // -----------------------
  // Universal Action Policy
  // -----------------------
  describe('Universal Action Policy', () => {
    it('should get install universal action policy with whole array', async () => {
      //skipping as it used the abi for the old contract
      // Setup
      const actionConfigData: ActionConfig = {
        valueLimitPerUse: 1000000000000000000n, // 1 ETH in wei
        paramRules: {
          length: 3n, // Only using the first 3 rules
          rules: [
            // Rule 1: Check if parameter equals a specific address
            {
              condition: ParamCondition.EQUAL,
              offset: 4n,
              isLimited: true,
              ref: '0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC address
              usage: {
                limit: 5n,
                used: 2n,
              },
            },
            // Rule 2: Check if parameter is less than some value
            {
              condition: ParamCondition.LESS_THAN,
              offset: 68n,
              isLimited: false,
              ref: '0x00000000000000000000000000000000000000000000005af3107a4000000000', // 100 tokens with 18 decimals
              usage: {
                limit: 0n,
                used: 0n,
              },
            },
            // Rule 3: Check if parameter is in range
            {
              condition: ParamCondition.IN_RANGE,
              offset: 100n,
              isLimited: true,
              ref: '0x000000000000000000000000000000000000000000000000000000000000162e', // Some reference value
              usage: {
                limit: 10n,
                used: 3n,
              },
            },
            // Remaining rules are placeholders but still required for the fixed-length array
            {
              condition: ParamCondition.EQUAL,
              offset: 0n,
              isLimited: false,
              ref: '0x0000000000000000000000000000000000000000000000000000000000000000',
              usage: { limit: 0n, used: 0n },
            },
            {
              condition: ParamCondition.EQUAL,
              offset: 0n,
              isLimited: false,
              ref: '0x0000000000000000000000000000000000000000000000000000000000000000',
              usage: { limit: 0n, used: 0n },
            },
            {
              condition: ParamCondition.EQUAL,
              offset: 0n,
              isLimited: false,
              ref: '0x0000000000000000000000000000000000000000000000000000000000000000',
              usage: { limit: 0n, used: 0n },
            },
            {
              condition: ParamCondition.EQUAL,
              offset: 0n,
              isLimited: false,
              ref: '0x0000000000000000000000000000000000000000000000000000000000000000',
              usage: { limit: 0n, used: 0n },
            },
            {
              condition: ParamCondition.EQUAL,
              offset: 0n,
              isLimited: false,
              ref: '0x0000000000000000000000000000000000000000000000000000000000000000',
              usage: { limit: 0n, used: 0n },
            },
            {
              condition: ParamCondition.EQUAL,
              offset: 0n,
              isLimited: false,
              ref: '0x0000000000000000000000000000000000000000000000000000000000000000',
              usage: { limit: 0n, used: 0n },
            },
            {
              condition: ParamCondition.EQUAL,
              offset: 0n,
              isLimited: false,
              ref: '0x0000000000000000000000000000000000000000000000000000000000000000',
              usage: { limit: 0n, used: 0n },
            },
            {
              condition: ParamCondition.EQUAL,
              offset: 0n,
              isLimited: false,
              ref: '0x0000000000000000000000000000000000000000000000000000000000000000',
              usage: { limit: 0n, used: 0n },
            },
            {
              condition: ParamCondition.EQUAL,
              offset: 0n,
              isLimited: false,
              ref: '0x0000000000000000000000000000000000000000000000000000000000000000',
              usage: { limit: 0n, used: 0n },
            },
            {
              condition: ParamCondition.EQUAL,
              offset: 0n,
              isLimited: false,
              ref: '0x0000000000000000000000000000000000000000000000000000000000000000',
              usage: { limit: 0n, used: 0n },
            },
            {
              condition: ParamCondition.EQUAL,
              offset: 0n,
              isLimited: false,
              ref: '0x0000000000000000000000000000000000000000000000000000000000000000',
              usage: { limit: 0n, used: 0n },
            },
            {
              condition: ParamCondition.EQUAL,
              offset: 0n,
              isLimited: false,
              ref: '0x0000000000000000000000000000000000000000000000000000000000000000',
              usage: { limit: 0n, used: 0n },
            },
            {
              condition: ParamCondition.EQUAL,
              offset: 0n,
              isLimited: false,
              ref: '0x0000000000000000000000000000000000000000000000000000000000000000',
              usage: { limit: 0n, used: 0n },
            },
          ],
        },
      }
      const installUniversalPolicy = getUniversalActionPolicy(actionConfigData)
      expect(installUniversalPolicy.address).toEqual(
        GLOBAL_CONSTANTS.UNIVERSAL_ACTION_POLICY_ADDRESS,
      )
      expect(installUniversalPolicy.initData).toBeDefined()
    })

    it('should get install universal action policy with js fill', async () => {
      //skipping as it used the abi for the old contract
      // Setup
      // Create a default ParamRule for filling unused slots
      const defaultParamRule: ParamRule = {
        condition: ParamCondition.EQUAL,
        offset: 0n,
        isLimited: false,
        ref: '0x0000000000000000000000000000000000000000000000000000000000000000',
        usage: { limit: 0n, used: 0n },
      }

      // Create active rules
      const activeRules: ParamRule[] = [
        // Rule 1: Check if parameter equals a specific address
        {
          condition: ParamCondition.EQUAL,
          offset: 4n,
          isLimited: true,
          ref: '0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC address
          usage: {
            limit: 5n,
            used: 2n,
          },
        },
        // Rule 2: Check if parameter is less than some value
        {
          condition: ParamCondition.LESS_THAN,
          offset: 68n,
          isLimited: false,
          ref: '0x00000000000000000000000000000000000000000000005af3107a4000000000', // 100 tokens with 18 decimals
          usage: {
            limit: 0n,
            used: 0n,
          },
        },
        // Rule 3: Check if parameter is in range
        {
          condition: ParamCondition.IN_RANGE,
          offset: 100n,
          isLimited: true,
          ref: '0x000000000000000000000000000000000000000000000000000000000000162e', // Some reference value
          usage: {
            limit: 10n,
            used: 3n,
          },
        },
      ]

      // Create a full 16-element array by combining active rules with default rules
      const allRules = [
        ...activeRules,
        ...Array(16 - activeRules.length).fill(defaultParamRule),
      ] as [
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
      ]

      // Create the full ActionConfig object
      const actionConfigData: ActionConfig = {
        valueLimitPerUse: 1000000000000000000n, // 1 ETH in wei
        paramRules: {
          length: BigInt(activeRules.length), // Only using the active rules
          rules: allRules,
        },
      }

      const installUniversalPolicy = getUniversalActionPolicy(actionConfigData)
      expect(installUniversalPolicy.address).toEqual(
        GLOBAL_CONSTANTS.UNIVERSAL_ACTION_POLICY_ADDRESS,
      )
      expect(installUniversalPolicy.initData).toBeDefined()
    })

    //   it('should get actionConfigs', async () => {
    //     const result = await getActionConfig({
    //       client: client,
    //       configId: toHex(1, { size: 32 }) as Hex,
    //       multiplexer: zeroAddress,
    //       userOpSender: zeroAddress,
    //     })
    //     expect(result).toBeDefined()
    //   })
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
        configId: toHex(1, { size: 32 }) as Hex,
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
        configId: toHex(1, { size: 32 }) as Hex,
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
        configId: toHex(1, { size: 32 }) as Hex,
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
        configId: toHex(1, { size: 32 }) as Hex,
        msgSender: zeroAddress,
        userOpSender: zeroAddress,
      })
      expect(result).toBeDefined()
    })
  })
})
