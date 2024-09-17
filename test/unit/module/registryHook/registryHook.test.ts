import { getRegistryHook } from 'src/module'
import { REGISTRY_HOOK_ADDRESS } from 'src'
import { Address } from 'viem'
import { getSetRegistryAction } from 'src'

describe('Registry hook Module', () => {
  // Setup
  const registryAddress =
    '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3' as Address

  it('should get install registry hook module', async () => {
    const installOwnableExecutorModule = getRegistryHook({
      registryAddress,
    })

    expect(installOwnableExecutorModule.module).toEqual(REGISTRY_HOOK_ADDRESS)
    expect(installOwnableExecutorModule.initData).toBeDefined()
    expect(installOwnableExecutorModule.type).toEqual('hook')
  })

  it('Should get setRegistryExecution action', async () => {
    const setRegistryExecution = getSetRegistryAction({
      registryAddress,
    })

    expect(setRegistryExecution.target).toEqual(REGISTRY_HOOK_ADDRESS)
    expect(setRegistryExecution.value).toEqual(BigInt(0))
    expect(setRegistryExecution.callData).toBeDefined()
  })
})
