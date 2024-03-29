import { getAccount, isModuleInstalled } from '../../../../src/account/api'
import { getModule } from '../../../../src/module/api/getModule'
import { getClient } from '../../../../src/common/getClient'
import { MockAccountDeployed } from '../../../utils/mocks/account'
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
  const account = getAccount(MockAccountDeployed)
  const validator = getModule({
    ...MockValidator,
    module: '0xB236CDE7e68431D874FD90E10b1910af5DC45DAc',
  })
  const executor = getModule({
    ...MockExecutor,
    module: '0x61291900F0810466802008A6B292e7Fa8C97cCF9',
  })
  const hook = getModule(MockHook)
  const fallback = getModule(MockFallback)
  const notInstalledModuleAddress = SENTINEL_ADDRESS

  it('Should return true for installed validator', async () => {
    const isInstalled = await isModuleInstalled({
      client,
      account,
      module: validator,
    })

    expect(isInstalled).toEqual(true)
  })
  it('Should return true for installed executor', async () => {
    const isInstalled = await isModuleInstalled({
      client,
      account,
      module: executor,
    })

    expect(isInstalled).toEqual(true)
  })
  it('Should return true for installed fallback', async () => {
    // Not implemented yet
    const isInstalled = await isModuleInstalled({
      client,
      account,
      module: fallback,
    })

    // Todo: currently no fallback installed on account
    expect(isInstalled).toEqual(false)
  })
  it('Should return true for installed hook', async () => {
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
