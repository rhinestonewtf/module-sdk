import { getAccount, uninstallModule } from 'src'
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
describe('Get calldata to uninstall a module', () => {
  // Setup
  const client = getClient(MockClient)
  const account = getAccount(MockSafeAccountDeployed)
  const validator = getModule(MockValidator)
  const executor = getModule(MockExecutor)
  const hook = getModule(MockSafeHook)
  const fallback = getModule(MockSafeFallback)

  // ToDo: Enable test case after implementing wildcard indexing
  it.skip('Should return the data to uninstall a validator', async () => {
    const executions = await uninstallModule({
      client,
      account,
      module: validator,
    })

    expect(executions.length).toEqual(0)
    // expect(executions[0].target).toEqual(account.address)
    // expect(Number(executions[0].value)).toEqual(0)
    // Todo: decode callData
  })
  it('Should return the data to uninstall an executor', async () => {
    const executions = await uninstallModule({
      client,
      account,
      module: executor,
    })
    expect(executions.length).toEqual(0)
  })
  it('Should return the data to uninstall a fallback handler', async () => {
    const executions = await uninstallModule({
      client,
      account,
      module: fallback,
    })
    expect(executions.length).toEqual(0)
  })
  it('Should return the data to uninstall a hook', async () => {
    const executions = await uninstallModule({ client, account, module: hook })

    expect(executions.length).toEqual(0)
  })
})
