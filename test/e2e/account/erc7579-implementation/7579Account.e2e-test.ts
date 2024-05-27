import { getAccount, isModuleInstalled } from 'src/account'

import {
  getBundlerClient,
  getPublicClient,
  getTestClient,
} from 'test/utils/userOps/clients'

import { setupEnvironment } from '../setupEnvironment'
import { cleanUpEnvironment } from '../cleanUpEnvironment'
import { getModule, OWNABLE_VALIDATOR_ADDRESS } from 'src/module'
import { OWNABLE_EXECUTER_ADDRESS } from 'src/module/ownable-executer'

describe('Test basic bundler functions', () => {
  const bundlerClient = getBundlerClient()
  const testClient = getTestClient()
  const publicClient = getPublicClient()
  const account = getAccount({
    address: '0xCA83633a0F6582b5bb2cDBC63E151d41999d7D47',
    type: 'erc7579-implementation',
  })

  beforeAll(async () => {
    await setupEnvironment({
      account,
      publicClient: publicClient,
      testClient,
      bundlerClient,
    })
  }, 20000)

  afterAll(async () => {
    await cleanUpEnvironment({
      account,
      client: publicClient,
      bundlerClient,
    })
  }, 20000)

  it('should return true when checking ownable validator isInstalled', async () => {
    const isOwnableValidatorInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'validator',
        module: OWNABLE_VALIDATOR_ADDRESS,
      }),
    })

    expect(isOwnableValidatorInstalled).toBe(true)
  }, 20000)

  it('should return true when checking ownable executer isInstalled', async () => {
    const isOwnableValidatorInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'executor',
        module: OWNABLE_EXECUTER_ADDRESS,
      }),
    })

    expect(isOwnableValidatorInstalled).toBe(true)
  }, 20000)
})
