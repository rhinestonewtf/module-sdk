import { keccak256, slice, toHex } from 'viem'
import { getModule } from 'src/module'

describe('Get Module implementation', () => {
  // Setup
  const address = slice(keccak256(toHex('address')), 0, 20)
  const initData = keccak256(toHex('initData'))
  const type = 'validator'

  it('should get and return an object with the passed arguments', async () => {
    const module = getModule({ module: address, initData, type })

    expect(module.module).toEqual(address)
    expect(module.initData).toEqual(initData)
    expect(module.type).toEqual(type)
  })
})
