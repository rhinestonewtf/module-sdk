import { getInstallRegistryHook } from 'src/module/registry-hook/installation'
import { REGISTRY_HOOK_ADDRESS } from 'src/module/registry-hook/constants'
import { Address } from 'viem'
import { getSetRegistryExecution } from 'src/module/registry-hook/usage'

describe('Registry hook Module', () => {
  // Setup
  const registryAddress =
    '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3' as Address

  it('should get install registry hook module', async () => {
    const installOwnableExecuterModule = getInstallRegistryHook({
      registryAddress,
    })

    expect(installOwnableExecuterModule.module).toEqual(REGISTRY_HOOK_ADDRESS)
    expect(installOwnableExecuterModule.data).toBeDefined()
    expect(installOwnableExecuterModule.type).toEqual('hook')
  })

  it('Should get setRegistryExecution action', async () => {
    const setRegistryExecution = getSetRegistryExecution({
      registryAddress,
    })

    expect(setRegistryExecution.target).toEqual(REGISTRY_HOOK_ADDRESS)
    expect(setRegistryExecution.value).toEqual(BigInt(0))
    expect(setRegistryExecution.callData).toBeDefined()
  })
})
