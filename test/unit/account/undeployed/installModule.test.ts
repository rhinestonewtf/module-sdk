import { getAccount, installModule } from '../../../../src/account/api'
import { getModule } from '../../../../src/module/api/getModule'
import { getClient } from '../../../../src/common/getClient'
import { MockAccountUndeployed } from '../../../utils/mocks/account'
import { MockClient } from '../../../utils/mocks/client'
import {
  MockExecutor,
  MockFallback,
  MockHook,
  MockValidator,
} from '../../../utils/mocks/module'
import { SENTINEL_ADDRESS } from '../../../../src/common/constants'

describe('Get calldata to install a module', () => {
  // Setup
  const client = getClient(MockClient)
  const account = getAccount(MockAccountUndeployed)
  const validator = getModule(MockValidator)
  const executor = getModule(MockExecutor)
  const hook = getModule(MockHook)
  const fallback = getModule(MockFallback)
  const notInstalledModuleAddress = SENTINEL_ADDRESS

  it('Should return the data to install a validator', async () => {
    validator.module = notInstalledModuleAddress
    const actions = await installModule({ client, account, module: validator })

    expect(actions.length).toEqual(1)
    expect(actions[0].target).toEqual(account.address)
    expect(Number(actions[0].value)).toEqual(0)
    // Todo: decode callData
  })
  it('Should return the data to install an executor', async () => {
    executor.module = notInstalledModuleAddress
    const actions = await installModule({ client, account, module: executor })

    expect(actions.length).toEqual(1)
    expect(actions[0].target).toEqual(account.address)
    expect(Number(actions[0].value)).toEqual(0)
    // Todo: decode callData
  })
  it('Should return the data to install a fallback handler', async () => {
    fallback.module = notInstalledModuleAddress
    const actions = await installModule({ client, account, module: fallback })
    expect(actions.length).toEqual(1)
    expect(actions[0].target).toEqual(account.address)
    expect(Number(actions[0].value)).toEqual(0)
    // Todo: decode callData
  })
  it('Should return the data to install a hook', async () => {
    hook.module = notInstalledModuleAddress
    const actions = await installModule({ client, account, module: hook })

    expect(actions.length).toEqual(1)
    expect(actions[0].target).toEqual(account.address)
    expect(Number(actions[0].value)).toEqual(0)
    // Todo: decode callData
  })
})
