import { getAccount, isModuleInstalled } from '../../../../src/account/api'
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
describe('Get installation status of module', () => {
  // Setup
  const client = getClient(MockClient)
  const account = getAccount(MockAccountUndeployed)
  const validator = getModule(MockValidator)
  const executor = getModule(MockExecutor)
  const hook = getModule(MockHook)
  const fallback = getModule(MockFallback)
  const notInstalledModuleAddress = SENTINEL_ADDRESS

  it('Should return true for installed validator', async () => {
    const isInstalled = await isModuleInstalled({
      client,
      account,
      module: validator,
    })

    expect(isInstalled).toEqual(false)
  })
  it('Should return true for installed executor', async () => {
    const isInstalled = await isModuleInstalled({
      client,
      account,
      module: executor,
    })

    expect(isInstalled).toEqual(false)
  })
  it('Should return true for installed fallback', async () => {
    // Not implemented yet
    const isInstalled = await isModuleInstalled({
      client,
      account,
      module: fallback,
    })
    expect(isInstalled).toEqual(false)
  })
  it('Should return true for installed hook', async () => {
    const isInstalled = await isModuleInstalled({
      client,
      account,
      module: hook,
    })

    expect(isInstalled).toEqual(false)
  })

  it('Should return false for not-installed validator', async () => {
    validator.module = notInstalledModuleAddress
    const isInstalled = await isModuleInstalled({
      client,
      account,
      module: validator,
    })

    expect(isInstalled).toEqual(false)
  })
  it('Should return false for not-installed executor', async () => {
    executor.module = notInstalledModuleAddress
    const isInstalled = await isModuleInstalled({
      client,
      account,
      module: executor,
    })

    expect(isInstalled).toEqual(false)
  })
  it('Should return false for not-installed fallback', async () => {
    fallback.module = notInstalledModuleAddress
    const isInstalled = await isModuleInstalled({
      client,
      account,
      module: fallback,
    })
    expect(isInstalled).toEqual(false)
  })
  it('Should return false for not-installed hook', async () => {
    hook.module = notInstalledModuleAddress
    const isInstalled = await isModuleInstalled({
      client,
      account,
      module: hook,
    })

    expect(isInstalled).toEqual(false)
  })
})
