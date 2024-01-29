import {
  getAccount,
  isModuleInstalled,
} from '../../../../src/account/common/api'
import { getModule } from '../../../../src/module/common/api/getModule'
import { getClient } from '../../../../src/common/getClient'
import { MockAccount } from '../../../utils/mocks/account'
import { MockClient } from '../../../utils/mocks/client'
import { MockModule } from '../../../utils/mocks/module'

describe('Get installation status of module', () => {
  // Setup
  const client = getClient(MockClient)
  const account = getAccount(MockAccount)
  const module = getModule(MockModule)

  it('Should return whether a validator is installed', async () => {
    const isInstalled = await isModuleInstalled({ client, account, module })

    expect(isInstalled).toEqual(false)
  })
  it('Should return whether an executor is installed', async () => {
    module.type = 'executor'
    const isInstalled = await isModuleInstalled({ client, account, module })

    expect(isInstalled).toEqual(false)
  })
  it('Should return whether a fallback handler is installed', async () => {
    // Not implemented yet
    // module.type = 'fallback'
    // const isInstalled = await isModuleInstalled({ client, account, module })
    // expect(isInstalled).toEqual(false)
  })
  it('Should return whether a hook is installed', async () => {
    module.type = 'hook'
    const isInstalled = await isModuleInstalled({ client, account, module })

    expect(isInstalled).toEqual(false)
  })
})
