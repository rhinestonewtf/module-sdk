import { Account, Execution, isModuleInstalled } from 'src/account'
import { getModule } from 'src/module'
import {
  AUTO_SAVINGS_ADDRESS,
  getAccountTokenConfig,
} from 'src/module/auto-savings'
import { getAddress, PublicClient, TestClient, zeroAddress } from 'viem'
import { getInstallModuleData, sendUserOp } from '../infra'
import {
  ConfigType,
  deleteConfig,
  getSetConfigExecution,
  getTokens,
} from 'src/module/auto-savings/usage'

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
        module: AUTO_SAVINGS_ADDRESS,
      }),
    })

    expect(isAutoSavingExecutorInstalled).toBe(true)
  }, 20000)

  it('should return auto savings config', async () => {
    const { autoSavingExecutor } = getInstallModuleData({ account })
    const config = await getAccountTokenConfig({
      client: publicClient,
      account,
      token: autoSavingExecutor.tokens[0],
    })

    const [percentage, vault, sqrtPriceLimitX96] = config as ConfigType

    expect(percentage).toEqual(autoSavingExecutor.configs[0].percentage)
    expect(vault).toEqual(autoSavingExecutor.configs[0].vault)
    expect(sqrtPriceLimitX96).toEqual(
      autoSavingExecutor.configs[0].sqrtPriceLimitX96,
    )
  }, 20000)

  it('should set auto savings config', async () => {
    const { autoSavingExecutor } = getInstallModuleData({ account })

    const newConfig = {
      percentage: 20 * 100,
      vault: autoSavingExecutor.configs[0].vault,
      sqrtPriceLimitX96: autoSavingExecutor.configs[0].sqrtPriceLimitX96,
    }

    const setConfigExecution = getSetConfigExecution({
      config: newConfig,
      token: autoSavingExecutor.tokens[0],
    })

    await sendUserOp({
      account,
      actions: [setConfigExecution],
    })

    const config = await getAccountTokenConfig({
      client: publicClient,
      account,
      token: autoSavingExecutor.tokens[0],
    })

    const [percentage, vault, sqrtPriceLimitX96] = config as ConfigType

    expect(percentage).toEqual(newConfig.percentage)
    expect(vault).toEqual(newConfig.vault)
    expect(sqrtPriceLimitX96).toEqual(newConfig.sqrtPriceLimitX96)
  }, 20000)

  it('should return auto savings tokens', async () => {
    const { autoSavingExecutor } = getInstallModuleData({ account })

    const tokens = await getTokens({
      account,
      client: publicClient,
    })

    expect(tokens.length).toEqual(autoSavingExecutor.tokens.length)
    expect(getAddress(tokens[0])).toEqual(
      getAddress(autoSavingExecutor.tokens[0]),
    )
  }, 20000)

  it('should be able to delete config for a token', async () => {
    const { autoSavingExecutor } = getInstallModuleData({ account })

    const deleteConfigAction = await deleteConfig({
      client: publicClient,
      account,
      token: autoSavingExecutor.tokens[0],
    })

    await sendUserOp({
      account,
      actions: [deleteConfigAction as Execution],
    })

    const config = await getAccountTokenConfig({
      client: publicClient,
      account,
      token: autoSavingExecutor.tokens[0],
    })

    const [percentage, vault, sqrtPriceLimitX96] = config as ConfigType

    expect(percentage).toEqual(0)
    expect(vault).toEqual(zeroAddress)
    expect(sqrtPriceLimitX96).toEqual(0n)
  }, 20000)
}
