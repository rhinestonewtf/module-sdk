import { Address, Hex } from 'viem'

export const ACCOUNT_LOCKER_HOOK = '0x29BDcBc36e344061393f8AB58D2D6AABaedeAaAE'
export const ACCOUNT_LOCKER_SOURCE_EXECUTOR =
  '0xE1058634834E01038CadbaE8208BFfF81B1Ede51'
export const ACCOUNT_LOCKER_TARGET_EXECUTOR =
  '0xA90F831363708B32a3f1502165253E0210cf680d'
export const AUTO_SAVINGS_ADDRESS: Address =
  '0x6AE48bD83B6bdc8489584Ea0814086f963d1BD95'
export const COLD_STORAGE_FLASHLOAN_ADDRESS: Address =
  '0x4422dbC3D055D59ee08F4A4D60E1046A9aFb287f'
export const COLD_STORAGE_HOOK_ADDRESS: Address =
  '0x7E31543b269632ddc55a23553f902f84C9DD8454'
export const DEADMAN_SWITCH_ADDRESS: Address =
  '0x8bAdE54bca47199B6732EB2F92318DD666bdE413'
export const SMART_SESSIONS_FALLBACK_TARGET_FLAG: Address =
  '0x0000000000000000000000000000000000000001'
export const SMART_SESSIONS_FALLBACK_TARGET_SELECTOR_FLAG: Hex = '0x00000001'
export const HOOK_MULTI_PLEXER_ADDRESS: Address =
  '0xF6782ed057F95f334D04F0Af1Af4D14fb84DE549'
export const INDEXER_URL =
  'https://indexer.bigdevenergy.link/c03b38d/v1/graphql'
export const MULTI_FACTOR_VALIDATOR_ADDRESS: Address =
  '0xf6bDf42c9BE18cEcA5C06c42A43DAf7FBbe7896b'
export const OWNABLE_EXECUTOR_ADDRESS: Address =
  '0x4Fd8d57b94966982B62e9588C27B4171B55E8354'
export const OWNABLE_VALIDATOR_ADDRESS: Address =
  '0x2483DA3A338895199E5e538530213157e931Bf06'
export const REGISTRY_ADDRESS: Address =
  '0x000000000069E2a187AEFFb852bF3cCdC95151B2'
export const REGISTRY_HOOK_ADDRESS: Address =
  '0x0ac6160DBA30d665cCA6e6b6a2CDf147DC3dED22'
export const SCHEDULED_ORDERS_EXECUTOR_ADDRESS: Address =
  '0x40dc90D670C89F322fa8b9f685770296428DCb6b'
export const SCHEDULED_TRANSFERS_EXECUTOR_ADDRESS: Address =
  '0xA8E374779aeE60413c974b484d6509c7E4DDb6bA'
export const SMART_SESSIONS_ADDRESS: Address =
  '0x00000000002B0eCfbD0496EE71e01257dA0E37DE'
export const SMART_SESSIONS_COMPATIBILITY_FALLBACK_ADDRESS: Address =
  '0xBad7E91C4F2803978cd6c7C3Fe80B5Fd7f7B0b50'
export const SOCIAL_RECOVERY_ADDRESS: Address =
  '0xA04D053b3C8021e8D5bF641816c42dAA75D8b597'
export const SPENDING_LIMITS_POLICY_ADDRESS: Address =
  '0x00000088D48cF102A8Cdb0137A9b173f957c6343'
export const TIME_FRAME_POLICY_ADDRESS: Address =
  '0x8177451511dE0577b911C254E9551D981C26dc72'
export const SUDO_POLICY_ADDRESS: Address =
  '0x0000003111cD8e92337C100F22B7A9dbf8DEE301'
export const UNIVERSAL_ACTION_POLICY_ADDRESS: Address =
  '0x0000006DDA6c463511C4e9B05CFc34C1247fCF1F'
export const UNIVERSAL_EMAIL_RECOVERY_ADDRESS: Address =
  '0x636632FA22052d2a4Fb6e3Bab84551B620b9C1F9'
export const USAGE_LIMIT_POLICY_ADDRESS: Address =
  '0x1F34eF8311345A3A4a4566aF321b313052F51493'
export const VALUE_LIMIT_POLICY_ADDRESS: Address =
  '0x730DA93267E7E513e932301B47F2ac7D062abC83'
export const WEBAUTHN_VALIDATOR_ADDRESS: Address =
  '0x2f167e55d42584f65e2e30a748f41ee75a311414'

export const DEFAULT_CONSTANTS = {
  ACCOUNT_LOCKER_HOOK,
  ACCOUNT_LOCKER_SOURCE_EXECUTOR,
  ACCOUNT_LOCKER_TARGET_EXECUTOR,
  AUTO_SAVINGS_ADDRESS,
  COLD_STORAGE_FLASHLOAN_ADDRESS,
  COLD_STORAGE_HOOK_ADDRESS,
  DEADMAN_SWITCH_ADDRESS,
  SMART_SESSIONS_FALLBACK_TARGET_FLAG,
  SMART_SESSIONS_FALLBACK_TARGET_SELECTOR_FLAG,
  HOOK_MULTI_PLEXER_ADDRESS,
  INDEXER_URL,
  MULTI_FACTOR_VALIDATOR_ADDRESS,
  OWNABLE_EXECUTOR_ADDRESS,
  OWNABLE_VALIDATOR_ADDRESS,
  REGISTRY_ADDRESS,
  REGISTRY_HOOK_ADDRESS,
  SCHEDULED_ORDERS_EXECUTOR_ADDRESS,
  SCHEDULED_TRANSFERS_EXECUTOR_ADDRESS,
  SMART_SESSIONS_ADDRESS,
  SMART_SESSIONS_COMPATIBILITY_FALLBACK_ADDRESS,
  SOCIAL_RECOVERY_ADDRESS,
  SPENDING_LIMITS_POLICY_ADDRESS,
  TIME_FRAME_POLICY_ADDRESS,
  UNIVERSAL_ACTION_POLICY_ADDRESS,
  SUDO_POLICY_ADDRESS,
  UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
  USAGE_LIMIT_POLICY_ADDRESS,
  VALUE_LIMIT_POLICY_ADDRESS,
  WEBAUTHN_VALIDATOR_ADDRESS,
} as const

export let GLOBAL_CONSTANTS = {
  ...DEFAULT_CONSTANTS,
}

export type Constants = typeof GLOBAL_CONSTANTS

export const setGlobalConstants = (overrides: Partial<Constants>): void => {
  GLOBAL_CONSTANTS = { ...GLOBAL_CONSTANTS, ...overrides }
}

export const getModifiedConstants = (
  overrides?: Partial<Constants>,
): Constants => {
  return { ...GLOBAL_CONSTANTS, ...overrides }
}

export const restoreGlobalConstants = (): void => {
  GLOBAL_CONSTANTS = { ...DEFAULT_CONSTANTS }
}
