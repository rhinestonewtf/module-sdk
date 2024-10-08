import { getAccount, isModuleInstalled } from 'src'
import { getModule } from 'src'
import { getClient } from 'src'
import { MockSafeAccountDeployed } from 'test/utils/mocks/account'
import { MockClient } from 'test/utils/mocks/client'
import {
  MockExecutor,
  MockSafeFallback,
  MockSafeHook,
  MockValidator,
} from 'test/utils/mocks/module'
import { SENTINEL_ADDRESS } from 'src'

describe('Get installation status of module', () => {
  // Setup
  const client = getClient(MockClient)
  const account = getAccount(MockSafeAccountDeployed)
  const validator = getModule(MockValidator)
  const executor = getModule({
    ...MockExecutor,
    module: '0x61291900F0810466802008A6B292e7Fa8C97cCF9',
  })
  const hook = getModule(MockSafeHook)
  const fallback = getModule(MockSafeFallback)
  const notInstalledModuleAddress = SENTINEL_ADDRESS

  it('Should return true for installed validator', async () => {
    const isInstalled = await isModuleInstalled({
      client,
      account,
      module: validator,
    })

    expect(isInstalled).toEqual(true)
  })
  it('Should return false for installed executor', async () => {
    const isInstalled = await isModuleInstalled({
      client,
      account,
      module: executor,
    })

    expect(isInstalled).toEqual(false)
  })
  it('Should return false for installed fallback', async () => {
    // Not implemented yet
    const isInstalled = await isModuleInstalled({
      client,
      account,
      module: fallback,
    })

    // Todo: currently no fallback installed on account
    expect(isInstalled).toEqual(false)
  })
  it('Should return false for installed hook', async () => {
    const isInstalled = await isModuleInstalled({
      client,
      account,
      module: hook,
    })

    // Todo: currently no hook installed on account
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
