import { getAccount, uninstallModule } from '../../../../src/Account/api'
import { getModule } from '../../../../src/Module/api/getModule'
import { getClient } from '../../../../src/common/getClient'
import { MockAccount } from '../../../utils/mocks/account'
import { MockClient } from '../../../utils/mocks/client'
import { MockModule } from '../../../utils/mocks/module'

describe('Get calldata to uninstall a module', () => {
  // Setup
  const client = getClient(MockClient)
  const account = getAccount(MockAccount)
  const module = getModule(MockModule)

  it('Should return the data to uninstall a validator', async () => {
    const actions = await uninstallModule({ client, account, module })

    expect(actions.length).toEqual(1)
    expect(actions[0].target).toEqual(account.address)
    expect(Number(actions[0].value)).toEqual(0)
    // Todo: decode callData
  })
  it('Should return the data to uninstall an executor', async () => {
    module.type = 'executor'
    const actions = await uninstallModule({ client, account, module })

    expect(actions.length).toEqual(1)
    expect(actions[0].target).toEqual(account.address)
    expect(Number(actions[0].value)).toEqual(0)
    // Todo: decode callData
  })
  it('Should return the data to uninstall a fallback handler', async () => {
    // Not implemented yet
    // module.type = 'fallback'
    // const actions = await uninstallModule({ client, account, module })
    // expect(actions.length).toEqual(1)
    // expect(actions[0].target).toEqual(account.address)
    // expect(Number(actions[0].value)).toEqual(0)
    // Todo: decode callData
  })
  it('Should return the data to uninstall a hook', async () => {
    module.type = 'hook'
    const actions = await uninstallModule({ client, account, module })

    expect(actions.length).toEqual(1)
    expect(actions[0].target).toEqual(account.address)
    expect(Number(actions[0].value)).toEqual(0)
    // Todo: decode callData
  })
})
