import {
  GLOBAL_CONSTANTS,
  DEFAULT_CONSTANTS,
  setGlobalConstants,
  getModifiedConstants,
  restoreGlobalConstants,
  Constants,
} from 'src/constants'
import { Address, zeroAddress } from 'viem'

describe('Constants Module', () => {
  afterEach(() => {
    restoreGlobalConstants()
  })

  test('GLOBAL_CONSTANTS should initially match DEFAULT_CONSTANTS', () => {
    expect(GLOBAL_CONSTANTS).toEqual(DEFAULT_CONSTANTS)
  })

  test('setGlobalConstants should override GLOBAL_CONSTANTS', () => {
    const overrides = {
      ACCOUNT_LOCKER_HOOK: zeroAddress as Address,
    } as Partial<Constants>
    setGlobalConstants(overrides)
    expect(GLOBAL_CONSTANTS.ACCOUNT_LOCKER_HOOK).toBe(
      overrides.ACCOUNT_LOCKER_HOOK,
    )
    expect(GLOBAL_CONSTANTS).not.toEqual(DEFAULT_CONSTANTS)
  })

  test('getModifiedConstants should return modified constants', () => {
    const overrides = {
      ACCOUNT_LOCKER_HOOK: '0xabcdef1234567890' as Address,
    } as Partial<Constants>
    const modifiedConstants = getModifiedConstants(overrides)
    expect(modifiedConstants.ACCOUNT_LOCKER_HOOK).toBe(
      overrides.ACCOUNT_LOCKER_HOOK,
    )
    expect(modifiedConstants).not.toEqual(GLOBAL_CONSTANTS)
  })

  test('restoreGlobalConstants should reset GLOBAL_CONSTANTS to DEFAULT_CONSTANTS', () => {
    const overrides = { ACCOUNT_LOCKER_HOOK: '0xabcdef1234567890' as Address} as Partial<Constants>
    setGlobalConstants(overrides)
    restoreGlobalConstants()
    expect(GLOBAL_CONSTANTS).toEqual(DEFAULT_CONSTANTS)
  })
})
