import { Account, isModuleInstalled } from 'src/account'
import { getModule } from 'src/module'
import { getDeadmanSwitchConfig } from 'src/module/deadman-switch'
import { getAddress, PublicClient, TestClient } from 'viem'
import { getInstallModuleData } from '../infra'
import { DeadmanSwitchConfigType } from 'src/module/deadman-switch/usage'
import { GLOBAL_CONSTANTS } from 'src/constants'

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
        module: GLOBAL_CONSTANTS.DEADMAN_SWITCH_ADDRESS,
      }),
    })

    expect(isDeadmanSwitchInstalled).toBe(true)
  }, 20000)

  it('should return deadman switch config', async () => {
    const { deadmanSwitchValidator } = getInstallModuleData({ account })

    const [, timeout, nominee] = (await getDeadmanSwitchConfig({
      account,
      client: publicClient,
    })) as DeadmanSwitchConfigType

    expect(getAddress(nominee)).toEqual(
      getAddress(deadmanSwitchValidator.nominee),
    )
    expect(timeout).toEqual(deadmanSwitchValidator.timeout)
  })
}
