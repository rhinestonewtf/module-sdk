import { isAccount } from '../../../src/account/utils'
import { Account } from '../../../src/account/types'
import { Address } from 'viem'

describe('isAccount', () => {
  const testAddress: Address = '0xa5cc3c03994dB5b0d9A5eEdD10CabaB0813678AC'

  test('should return true for a valid Account object', () => {
    const validAccount: Account = {
      address: testAddress,
      type: 'kernel',
      deployedOnChains: [1, 2, 3],
    }
    expect(isAccount(validAccount)).toBe(true)
  })

  test('should return false for an object with an invalid address', () => {
    const invalidAccount = {
      address: '1234567890abcdef',
      type: 'kernel',
      deployedOnChains: [1, 2, 3],
    }
    expect(isAccount(invalidAccount)).toBe(false)
  })

  test('should return false for an object with an invalid type', () => {
    const invalidAccount = {
      address: testAddress,
      type: 'invalid-type',
      deployedOnChains: [1, 2, 3],
    }
    expect(isAccount(invalidAccount)).toBe(false)
  })

  test('should return false for an object with an invalid deployedOnChains', () => {
    const invalidAccount = {
      address: testAddress,
      type: 'kernel',
      deployedOnChains: ['1', '2', '3'],
    }
    expect(isAccount(invalidAccount)).toBe(false)
  })

  test('should return false for a non-object input', () => {
    expect(isAccount(null)).toBe(false)
    expect(isAccount(undefined)).toBe(false)
    expect(isAccount(123)).toBe(false)
    expect(isAccount('string')).toBe(false)
  })

  test('should return true for a valid Account object with initCode', () => {
    const validAccount: Account = {
      address: testAddress,
      type: 'kernel',
      deployedOnChains: [1, 2, 3],
      initCode: '0xabcdef',
    }
    expect(isAccount(validAccount)).toBe(true)
  })

  test('should return false for an object with an invalid initCode', () => {
    const invalidAccount = {
      address: testAddress,
      type: 'kernel',
      deployedOnChains: [1, 2, 3],
      initCode: 'abcdef',
    }
    expect(isAccount(invalidAccount)).toBe(false)
  })
})
