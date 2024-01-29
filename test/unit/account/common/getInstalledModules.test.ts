import {
  createAccount,
  getInstalledModules,
} from '../../../../src/account/common/api'
import { createClient } from '../../../../src/common/createClient'
import { MockAccount } from '../../../utils/mocks/account'
import { MockClient } from '../../../utils/mocks/client'

describe('Get all installed modules', () => {
  // Setup
  const client = createClient(MockClient)
  const account = createAccount(MockAccount)

  it('Should return all installed modules', async () => {
    const modules = await getInstalledModules({ client, account })

    expect(modules.length).toEqual(1)
    // Todo: decode callData
  })
})
