import { Address } from 'viem'

export const UNIVERSAL_EMAIL_RECOVERY_ADDRESS: Address =
  '0x36A470159F8170ad262B9518095a9FeD0824e7dD'

export const MAX_VALIDATORS = 32
export const MAX_NUMBER_OF_GUARDIANS = 32
export const MINIMUM_RECOVERY_WINDOW = 2 * 24 * 60 * 60 // 2 days in seconds;
export const CANCEL_EXPIRED_RECOVERY_COOLDOWN = 24 * 60 * 60 // 1 day in seconds;
