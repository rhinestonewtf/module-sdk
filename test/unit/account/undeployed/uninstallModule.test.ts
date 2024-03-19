import { getAccount, uninstallModule } from '../../../../src/account/api'
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
describe('Get calldata to uninstall a module', () => {
  // Setup
  const client = getClient(MockClient)
  const account = getAccount(MockAccountUndeployed)
  const validator = getModule(MockValidator)
  const executor = getModule(MockExecutor)
  const hook = getModule(MockHook)
  const fallback = getModule(MockFallback)
  it('Should return the data to uninstall a validator', async () => {
    const actions = await uninstallModule({
      client,
      account,
      module: validator,
    })

    expect(actions.length).toEqual(1)
    expect(actions[0].target).toEqual(account.address)
    expect(Number(actions[0].value)).toEqual(0)
    // Todo: decode callData
  })
  it('Should return the data to uninstall an executor', async () => {
    const actions = await uninstallModule({ client, account, module: executor })

    expect(actions.length).toEqual(1)
    expect(actions[0].target).toEqual(account.address)
    expect(Number(actions[0].value)).toEqual(0)
    // Todo: decode callData
  })
  it('Should return the data to uninstall a fallback handler', async () => {
    const actions = await uninstallModule({ client, account, module: fallback })
    expect(actions.length).toEqual(1)
    expect(actions[0].target).toEqual(account.address)
    expect(Number(actions[0].value)).toEqual(0)
    // Todo: decode callData
  })
  it('Should return the data to uninstall a hook', async () => {
    const actions = await uninstallModule({ client, account, module: hook })

    expect(actions.length).toEqual(1)
    expect(actions[0].target).toEqual(account.address)
    expect(Number(actions[0].value)).toEqual(0)
    // Todo: decode callData
  })
})
