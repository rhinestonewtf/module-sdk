import { Account, isModuleInstalled } from 'src/account'
import { getModule } from 'src/module'
import { REGISTRY_HOOK_ADDRESS } from 'src/module/registry-hook'
import { PublicClient, TestClient } from 'viem'

type Params = {
  account: Account
  publicClient: PublicClient
  testClient: TestClient
}

export const testRegistryHook = async ({ account, publicClient }: Params) => {
  it('should return true when checking registry hook isInstalled', async () => {
    const isRegistryHookInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'hook',
        module: REGISTRY_HOOK_ADDRESS,
      }),
    })

    expect(isRegistryHookInstalled).toBe(false)
  }, 20000)
}
