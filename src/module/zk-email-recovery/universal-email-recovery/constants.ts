import { Address } from 'viem'
import { base, sepolia } from 'viem/chains'

export const UNIVERSAL_EMAIL_RECOVERY_ADDRESS__BASE: Address =
  '0x36A470159F8170ad262B9518095a9FeD0824e7dD'
export const UNIVERSAL_EMAIL_RECOVERY_ADDRESS__ETH_SEPOLIA: Address =
  '0x8ECcb707C4770239D7e95743cd01aaA72d6D313E'

export const MAX_VALIDATORS = 32
export const MAX_NUMBER_OF_GUARDIANS = 32
export const MINIMUM_RECOVERY_WINDOW = 2 * 24 * 60 * 60 // 2 days in seconds;
export const CANCEL_EXPIRED_RECOVERY_COOLDOWN = 24 * 60 * 60 // 1 day in seconds;

/** Helper function get the module address based on chain id */
export const getModuleAddress = (chainId: number): Address => {
  if (chainId === sepolia.id) {
    return UNIVERSAL_EMAIL_RECOVERY_ADDRESS__ETH_SEPOLIA
  }
  if (chainId === base.id) {
    return UNIVERSAL_EMAIL_RECOVERY_ADDRESS__BASE
  }
  throw new Error('Unsupported chain')
}
