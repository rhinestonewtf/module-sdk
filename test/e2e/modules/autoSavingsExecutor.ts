import { Account, Execution, isModuleInstalled } from 'src/account'
import { getModule } from 'src/module'
import { getAutoSavingAccountTokenConfig } from 'src/module/auto-savings'
import { getAddress, PublicClient, TestClient, zeroAddress } from 'viem'
import { getInstallModuleData, sendUserOp } from '../infra'
import {
  ConfigType,
  getDeleteAutoSavingConfigAction,
  getSetAutoSavingConfigAction,
  getAutoSavingTokens,
} from 'src/module/auto-savings/usage'
import { GLOBAL_CONSTANTS } from 'src/constants'

type Params = {
  account: Account
  publicClient: PublicClient
  testClient: TestClient
}

export const testAutoSavingsExecutor = async ({
  account,
  publicClient,
}: Params) => {
  it('should return true when checking auto saving executor isInstalled', async () => {
    const isAutoSavingExecutorInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'executor',
        module: GLOBAL_CONSTANTS.AUTO_SAVINGS_ADDRESS,
      }),
    })

    expect(isAutoSavingExecutorInstalled).toBe(true)
  }, 20000)

  it('should return auto savings config', async () => {
    const { autoSavingExecutor } = getInstallModuleData({ account })
    const config = await getAutoSavingAccountTokenConfig({
      client: publicClient,
      account,
      token: autoSavingExecutor.configs[0].token,
    })

    const [percentage, vault] = config as ConfigType

    expect(percentage).toEqual(autoSavingExecutor.configs[0].percentage)
    expect(vault).toEqual(autoSavingExecutor.configs[0].vault)
  }, 20000)

  it('should set auto savings config', async () => {
    const { autoSavingExecutor } = getInstallModuleData({ account })

    const newConfig = {
      percentage: BigInt(20 * 100),
      vault: autoSavingExecutor.configs[0].vault,
    }

    const setConfigExecution = getSetAutoSavingConfigAction({
      config: newConfig,
      token: autoSavingExecutor.configs[0].token,
    })

    await sendUserOp({
      account,
      actions: [setConfigExecution],
    })

    const config = await getAutoSavingAccountTokenConfig({
      client: publicClient,
      account,
      token: autoSavingExecutor.configs[0].token,
    })

    const [percentage, vault] = config as ConfigType

    expect(percentage).toEqual(newConfig.percentage)
    expect(vault).toEqual(newConfig.vault)
  }, 20000)

  it('should return auto savings tokens', async () => {
    const { autoSavingExecutor } = getInstallModuleData({ account })

    const tokens = await getAutoSavingTokens({
      account,
      client: publicClient,
    })

    expect(tokens.length).toEqual(autoSavingExecutor.configs.length)
    expect(getAddress(tokens[0])).toEqual(
      getAddress(autoSavingExecutor.configs[0].token),
    )
  }, 20000)

  it('should be able to delete config for a token', async () => {
    const { autoSavingExecutor } = getInstallModuleData({ account })

    const deleteConfigAction = await getDeleteAutoSavingConfigAction({
      client: publicClient,
      account,
      token: autoSavingExecutor.configs[0].token,
    })

    await sendUserOp({
      account,
      actions: [deleteConfigAction as Execution],
    })

    const config = await getAutoSavingAccountTokenConfig({
      client: publicClient,
      account,
      token: autoSavingExecutor.configs[0].token,
    })

    const [percentage, vault] = config as ConfigType

    expect(percentage).toEqual(0n)
    expect(vault).toEqual(zeroAddress)
  }, 20000)
}
