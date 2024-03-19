import { keccak256, slice, toHex } from 'viem'
import { getModule } from '../../../src/module/api/getModule'

describe('Get Module implementation', () => {
  // Setup
  const address = slice(keccak256(toHex('address')), 0, 20)
  const data = keccak256(toHex('data'))
  const type = 'validator'

  it('should get and return an object with the passed arguments', async () => {
    const module = getModule({ module: address, data, type })

    expect(module.module).toEqual(address)
    expect(module.data).toEqual(data)
    expect(module.type).toEqual(type)
  })
})
