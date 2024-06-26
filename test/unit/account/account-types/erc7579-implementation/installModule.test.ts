import { getAccount, installModule } from 'src'
import { getModule } from 'src'
import { getClient } from 'src'
import { MockAccountDeployed } from 'test/utils/mocks/account'
import { MockClient } from 'test/utils/mocks/client'
import {
  MockExecutor,
  MockFallback,
  MockHook,
  MockValidator,
} from 'test/utils/mocks/module'
import { SENTINEL_ADDRESS } from 'src'

describe('Get calldata to install a module', () => {
  // Setup
  const client = getClient(MockClient)
  const account = getAccount(MockAccountDeployed)
  const validator = getModule(MockValidator)
  const executor = getModule(MockExecutor)
  const hook = getModule(MockHook)
  const fallback = getModule(MockFallback)
  const notInstalledModuleAddress = SENTINEL_ADDRESS

  it('Should return the data to install a validator', async () => {
    validator.module = notInstalledModuleAddress
    const executions = await installModule({
      client,
      account,
      module: validator,
    })

    expect(executions.length).toEqual(1)
    expect(executions[0].target).toEqual(account.address)
    expect(Number(executions[0].value)).toEqual(0)
    // Todo: decode callData
  })
  it('Should return the data to install an executor', async () => {
    executor.module = notInstalledModuleAddress
    const executions = await installModule({
      client,
      account,
      module: executor,
    })

    expect(executions.length).toEqual(1)
    expect(executions[0].target).toEqual(account.address)
    expect(Number(executions[0].value)).toEqual(0)
    // Todo: decode callData
  })
  it('Should return the data to install a fallback handler', async () => {
    fallback.module = notInstalledModuleAddress
    const executions = await installModule({
      client,
      account,
      module: fallback,
    })
    expect(executions.length).toEqual(1)
    expect(executions[0].target).toEqual(account.address)
    expect(Number(executions[0].value)).toEqual(0)
    // Todo: decode callData
  })
  it('Should return the data to install a hook', async () => {
    hook.module = notInstalledModuleAddress
    const executions = await installModule({ client, account, module: hook })

    expect(executions.length).toEqual(1)
    expect(executions[0].target).toEqual(account.address)
    expect(Number(executions[0].value)).toEqual(0)
    // Todo: decode callData
  })
})
