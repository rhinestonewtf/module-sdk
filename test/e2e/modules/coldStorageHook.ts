import { Account, isModuleInstalled } from 'src/account'
import { getModule } from 'src/module'
import {
  COLD_STORAGE_HOOK_ADDRESS,
  COLD_STORAGE_FLASHLOAN_ADDRESS,
} from 'src/module/cold-storage'
import { PublicClient, TestClient } from 'viem'

type Params = {
  account: Account
  publicClient: PublicClient
  testClient: TestClient
}

export const testColdStorageHook = async ({
  account,
  publicClient,
}: Params) => {
  it('should return true when checking VCS isInstalled', async () => {
    const isColdStorageExecutorInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'executor',
        module: COLD_STORAGE_HOOK_ADDRESS,
      }),
    })

    expect(isColdStorageExecutorInstalled).toBe(true)
  }, 20000)

  it('should return true when checking VCS fallback isInstalled', async () => {
    const isFlashloanInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'fallback',
        module: COLD_STORAGE_FLASHLOAN_ADDRESS,
        selector: '0x00000000',
      }),
    })

    expect(isFlashloanInstalled).toBe(true)
  }, 20000)
}
