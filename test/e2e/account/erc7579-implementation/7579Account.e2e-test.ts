import { getAccount } from 'src/account'
import { getPublicClient, getTestClient } from 'test/utils/userOps/clients'
import { setupEnvironment, cleanUpEnvironment } from '../../infra'
import {
  testAutoSavingsExecutor,
  testDeadmanSwitchValidator,
  testMultiFactorValidator,
  testOwnableExecutor,
  testOwnableValidator,
  testRegistryHook,
  testColdStorageHook,
  testScheduledOrdersExecutor,
  testScheduledTransfersExecutor,
  testHookMultiPlexer,
  testSocialRecoveryValidator,
} from 'test/e2e/modules'

describe('Test erc7579 reference implementation', () => {
  const testClient = getTestClient()
  const publicClient = getPublicClient()
  const account = getAccount({
    address: '0x7227dcfb0c5ec7a5f539f97b18be261c49687ed6',
    type: 'erc7579-implementation',
  })

  beforeAll(async () => {
    await setupEnvironment({
      account,
      publicClient: publicClient,
      testClient,
    })
  }, 20000)

  afterAll(async () => {
    await cleanUpEnvironment({
      account,
      client: publicClient,
    })
  }, 20000)

  testOwnableValidator({
    account,
    publicClient,
    testClient,
  })

  testOwnableExecutor({
    account,
    publicClient,
    testClient,
  })

  testAutoSavingsExecutor({
    account,
    publicClient,
    testClient,
  })

  testDeadmanSwitchValidator({
    account,
    publicClient,
    testClient,
  })

  testSocialRecoveryValidator({
    account,
    publicClient,
    testClient,
  })

  testRegistryHook({
    account,
    publicClient,
    testClient,
  })

  testMultiFactorValidator({
    account,
    publicClient,
    testClient,
  })

  testColdStorageHook({
    account,
    publicClient,
    testClient,
  })

  testScheduledOrdersExecutor({
    account,
    publicClient,
    testClient,
  })

  testScheduledTransfersExecutor({
    account,
    publicClient,
    testClient,
  })

  testHookMultiPlexer({
    account,
    publicClient,
    testClient,
  })
})
