import { Account, isModuleInstalled } from 'src/account'
import { SafeHookType } from 'src'
import { getModule } from 'src/module'
import { REGISTRY_HOOK_ADDRESS } from 'src'
import { PublicClient, TestClient } from 'viem'

type Params = {
  account: Account
  publicClient: PublicClient
  testClient: TestClient
}

export const testRegistryHook = async ({ account, publicClient }: Params) => {
  it('should return false when checking registry hook isInstalled', async () => {
    const isRegistryHookInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'hook',
        module: REGISTRY_HOOK_ADDRESS,
        hookType: SafeHookType.GLOBAL,
        selector: '0x00000000',
      }),
    })

    expect(isRegistryHookInstalled).toBe(false)
  }, 20000)
}
