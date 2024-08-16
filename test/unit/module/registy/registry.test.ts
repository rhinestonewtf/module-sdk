import { fetchRegistryModules } from 'src/module'
import { getPublicClient } from 'test/utils/userOps/clients'
import { sepolia } from 'viem/chains'

describe('Registry Module', () => {
  it('should get registered modules in the registry', async () => {
    const registeredModules = await fetchRegistryModules({
      client: getPublicClient(sepolia),
    })
    expect(registeredModules.length).toBeTruthy()
  })
})
