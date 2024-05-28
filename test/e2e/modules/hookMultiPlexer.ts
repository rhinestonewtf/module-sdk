import { Account, isModuleInstalled } from 'src/account'
import { getModule } from 'src/module'
import { HOOK_MULTI_PLEXER_ADDRESS } from 'src/module/hook-multi-plexer'
import { PublicClient, TestClient } from 'viem'

type Params = {
  account: Account
  publicClient: PublicClient
  testClient: TestClient
}

export const testHookMultiPlexer = async ({
  account,
  publicClient,
}: Params) => {
  it('should return true when checking hook multi plexer isInstalled', async () => {
    const isHookMultiPlexerInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'hook',
        module: HOOK_MULTI_PLEXER_ADDRESS,
      }),
    })

    expect(isHookMultiPlexerInstalled).toBe(true)
  }, 20000)
}
