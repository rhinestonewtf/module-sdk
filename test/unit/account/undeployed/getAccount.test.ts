import { keccak256, slice, toHex } from 'viem'
import { getAccount } from '../../../../src/account/api'

describe('Get Account implementation', () => {
  // Setup
  const address = slice(keccak256(toHex('address')), 0, 20)
  const initCode = keccak256(toHex('initCode'))
  const type = 'erc7579-implementation'
  const deployedOnChains = [1, 2, 3]

  it('should create and return an object with the passed arguments', async () => {
    const account = getAccount({ address, initCode, type, deployedOnChains })

    expect(account.address).toEqual(address)
    expect(account.initCode).toEqual(initCode)
    expect(account.type).toEqual(type)
    expect(account.deployedOnChains).toEqual(deployedOnChains)
  })
})
