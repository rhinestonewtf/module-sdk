import { fetchRegistryModules } from 'src/module'
import { getPublicClient } from 'test/utils/userOps/clients'

describe('Registry Module', () => {
  it('should get registered modules in the registry', async () => {
    const registeredModules = await fetchRegistryModules({
      client: getPublicClient(),
    })
    expect(registeredModules.length).toBeTruthy()
  })
})
