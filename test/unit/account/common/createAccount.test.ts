import { keccak256, slice, toHex, zeroAddress } from 'viem'
import { createAccount } from '../../../../src/account/common/api'
import { Account } from '../../../../src/account/common/Account'

describe('Create Account implementation', () => {
  // Setup
  const address = slice(keccak256(toHex('address')), 0, 20)
  const initCode = keccak256(toHex('initCode'))

  it('should create and return an object with the passed arguments', async () => {
    const account = createAccount(address, initCode)

    expect(account.address).toEqual(address)
    expect(account.initCode).toEqual(initCode)
  })
})
