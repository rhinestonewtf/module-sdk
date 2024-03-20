import { getInitData } from '../../../../../src/account/erc7579-implementation/api/getInitData'
import { MockAccountUndeployed } from '../../../../utils/mocks/account'

describe('Get initData from initCode', () => {
  // Setup
  const initCode = MockAccountUndeployed.initCode!

  it('Should return initial modules', async () => {
    const modules = await getInitData({ initCode })

    expect(modules.validators.length).toEqual(1)
    expect(modules.executors.length).toEqual(1)
    expect(modules.hooks.length).toEqual(1)
    expect(modules.fallbacks.length).toEqual(1)
  })
})
