import { getAccount, getInstalledModules } from '../../../../src/account/api'
import { getClient } from '../../../../src/common/getClient'
import { MockAccountDeployed } from '../../../utils/mocks/account'
import { MockClient } from '../../../utils/mocks/client'

describe('Get all installed modules', () => {
  // Setup
  const client = getClient(MockClient)
  const account = getAccount(MockAccountDeployed)

  it('Should return all installed modules', async () => {
    const modules = await getInstalledModules({ client, account })

    expect(modules.length).toEqual(3)
  })
})
