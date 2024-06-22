import { Account, isModuleInstalled } from 'src/account'
import { SafeHookType } from 'src'
import { getModule } from 'src/module'
import { HOOK_MULTI_PLEXER_ADDRESS } from 'src'
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
        hookType: SafeHookType.GLOBAL,
        selector: '0x00000000',
      }),
    })

    expect(isHookMultiPlexerInstalled).toBe(
      account.type === 'kernel' ? false : true,
    )
  }, 20000)
}
