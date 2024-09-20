import { AUTO_SAVINGS_ADDRESS, getAutoSavingsExecutor } from 'src/module'
import { Address, zeroAddress } from 'viem'
import {
  getSetAutoSavingConfigAction,
  getDeleteAutoSavingConfigAction,
  getAutoSavingTokens,
  getAutoSaveAction,
  getAutoSavingAccountTokenConfig,
} from 'src'
import { getClient } from 'src'
import { MockClient } from '../../../utils/mocks/client'
import { Execution, getAccount } from 'src'
import { MockAccountDeployed } from '../../../utils/mocks/account'

describe('Auto Savings Module', () => {
  // Setup
  const client = getClient(MockClient)
  const account = getAccount(MockAccountDeployed)
  const tokens = ['0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3'] as Address[]
  const configs = [
    {
      percentage: 10,
      vault: '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3' as Address,
      sqrtPriceLimitX96: BigInt(10),
    },
  ]

  it('should get install auto savings module', async () => {
    const installAutoSavingsModule = getAutoSavingsExecutor({
      tokens,
      configs,
    })

    expect(installAutoSavingsModule.module).toEqual(AUTO_SAVINGS_ADDRESS)
    expect(installAutoSavingsModule.initData).toBeDefined()
    expect(installAutoSavingsModule.type).toEqual('executor')
  })

  it('should get setConfig execution', async () => {
    const setConfigExecution = getSetAutoSavingConfigAction({
      token: tokens[0],
      config: configs[0],
    })

    expect(setConfigExecution.target).toEqual(AUTO_SAVINGS_ADDRESS)
    expect(setConfigExecution.value).toEqual(BigInt(0))
    expect(setConfigExecution.callData).toBeDefined()
  })

  it('should throw error if token to delete does not exist', async () => {
    async function getAction() {
      await getDeleteAutoSavingConfigAction({
        client,
        account: account,
        token: tokens[0],
      })
    }

    await expect(getAction).rejects.toThrow(
      'Failed to delete config for token 0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3',
    )
  })

  it('Should get list of account tokens', async () => {
    const tokens = await getAutoSavingTokens({
      account,
      client,
    })
    expect(tokens.length).toEqual(0)
  })

  it('should get autoSave execution', async () => {
    const autoSaveExecution = (await getAutoSaveAction({
      token: tokens[0],
      amountReceived: 100,
    })) as Execution

    expect(autoSaveExecution.target).toEqual(AUTO_SAVINGS_ADDRESS)
    expect(autoSaveExecution.value).toEqual(BigInt(0))
    expect(autoSaveExecution.callData).toBeDefined()
  })

  it('should get account token config', async () => {
    const [percentage, vault, sqrtPriceLimitX96] =
      (await getAutoSavingAccountTokenConfig({
        account,
        client,
        token: tokens[0],
      })) as [number, Address, number]

    expect(percentage).toEqual(0)
    expect(vault).toEqual(zeroAddress)
    expect(Number(sqrtPriceLimitX96)).toEqual(0)
  })
})
