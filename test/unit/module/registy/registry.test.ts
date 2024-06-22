import { fetchRegistryModules } from 'src'

describe('Registry Module', () => {
  it('should get registered modules in the registry', async () => {
    const registeredModules = await fetchRegistryModules()
    expect(registeredModules.length).toBeTruthy()
  })
})
