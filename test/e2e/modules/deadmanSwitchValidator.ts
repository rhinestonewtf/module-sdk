import { Account, isModuleInstalled } from 'src/account'
import { getModule } from 'src/module'
import { DEADMAN_SWITCH_ADDRESS } from 'src/module/deadman-switch'
import { PublicClient, TestClient } from 'viem'

type Params = {
  account: Account
  publicClient: PublicClient
  testClient: TestClient
}

export const testDeadmanSwitchValidator = async ({
  account,
  publicClient,
}: Params) => {
  it('should return true when checking deadman switch validator isInstalled', async () => {
    const isDeadmanSwitchInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'validator',
        module: DEADMAN_SWITCH_ADDRESS,
      }),
    })

    expect(isDeadmanSwitchInstalled).toBe(true)
  }, 20000)
}
