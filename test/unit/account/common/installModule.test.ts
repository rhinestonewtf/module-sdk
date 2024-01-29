import {
  createAccount,
  installModule,
} from '../../../../src/account/common/api'
import { createModule } from '../../../../src/module/common/api/createModule'
import { createClient } from '../../../../src/common/createClient'
import { MockAccount } from '../../../utils/mocks/account'
import { MockClient } from '../../../utils/mocks/client'
import { MockModule } from '../../../utils/mocks/module'

describe('Get calldata to install a module', () => {
  // Setup
  const client = createClient(MockClient)
  const account = createAccount(MockAccount)
  const module = createModule(MockModule)

  it('Should return the data to install a validator', async () => {
    const actions = await installModule({ client, account, module })

    expect(actions.length).toEqual(1)
    expect(actions[0].target).toEqual(account.address)
    expect(Number(actions[0].value)).toEqual(0)
    // Todo: decode callData
  })
  it('Should return the data to install an executor', async () => {
    module.type = 'executor'
    const actions = await installModule({ client, account, module })

    expect(actions.length).toEqual(1)
    expect(actions[0].target).toEqual(account.address)
    expect(Number(actions[0].value)).toEqual(0)
    // Todo: decode callData
  })
  it('Should return the data to install a fallback handler', async () => {
    // Not implemented yet
    // module.type = 'fallback'
    // const actions = await installModule({ client, account, module })
    // expect(actions.length).toEqual(1)
    // expect(actions[0].target).toEqual(account.address)
    // expect(Number(actions[0].value)).toEqual(0)
    // Todo: decode callData
  })
  it('Should return the data to install a hook', async () => {
    module.type = 'hook'
    const actions = await installModule({ client, account, module })

    expect(actions.length).toEqual(1)
    expect(actions[0].target).toEqual(account.address)
    expect(Number(actions[0].value)).toEqual(0)
    // Todo: decode callData
  })
})
