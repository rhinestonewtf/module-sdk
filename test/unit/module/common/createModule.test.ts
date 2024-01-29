import { keccak256, slice, toHex, zeroAddress } from 'viem'
import { createModule } from '../../../../src/module/common/api/createModule'

describe('Create Module implementation', () => {
  // Setup
  const address = slice(keccak256(toHex('address')), 0, 20)
  const initData = keccak256(toHex('initData'))
  const type = 'validator'

  it('should create and return an object with the passed arguments', async () => {
    const module = createModule({ address, initData, type })

    expect(module.address).toEqual(address)
    expect(module.initData).toEqual(initData)
    expect(module.type).toEqual(type)
  })
})
