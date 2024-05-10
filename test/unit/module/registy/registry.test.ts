import { fetchRegistryModules } from 'src/module/registry/usage'

describe('Registry Module', () => {
  it('should get registered modules in the registry', async () => {
    const registeredModules = await fetchRegistryModules()
    expect(registeredModules.length).toEqual(0)
  })
})
