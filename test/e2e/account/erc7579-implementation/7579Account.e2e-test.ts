import { getAccount, isModuleInstalled } from 'src/account'

import {
  getBundlerClient,
  getPublicClient,
  getTestClient,
} from 'test/utils/userOps/clients'

import { setupEnvironment } from '../setupEnvironment'
import { cleanUpEnvironment } from '../cleanUpEnvironment'
import {
  getModule,
  OWNABLE_VALIDATOR_ADDRESS,
  SCHEDULED_ORDERS_EXECUTER_ADDRESS,
  SCHEDULED_TRANSFERS_EXECUTER_ADDRESS,
} from 'src/module'
import { OWNABLE_EXECUTER_ADDRESS } from 'src/module/ownable-executer'
import { SOCIAL_RECOVERY_ADDRESS } from 'src/module/social-recovery/constants'
import { AUTO_SAVINGS_ADDRESS } from 'src/module/auto-savings'
import { DEADMAN_SWITCH_ADDRESS } from 'src/module/deadman-switch'
import { REGISTRY_HOOK_ADDRESS } from 'src/module/registry-hook'
import { MULTI_FACTOR_VALIDATOR_ADDRESS } from 'src/module/multi-factor-validator'
import {
  COLD_STORAGE_FLASHLOAN_ADDRESS,
  COLD_STORAGE_HOOK_ADDRESS,
} from 'src/module/cold-storage'
import { HOOK_MULTI_PLEXER_ADDRESS } from 'src/module/hook-multi-plexer'

describe('Test basic bundler functions', () => {
  const bundlerClient = getBundlerClient()
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

  it('should return true when checking social recovery validator isInstalled', async () => {
    const isSocialRecoveryValidatorInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'validator',
        module: SOCIAL_RECOVERY_ADDRESS,
      }),
    })

    expect(isSocialRecoveryValidatorInstalled).toBe(true)
  }, 20000)

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

  it('should return true when checking registry hook isInstalled', async () => {
    const isRegistryHookInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'hook',
        module: REGISTRY_HOOK_ADDRESS,
      }),
    })

    expect(isRegistryHookInstalled).toBe(false)
  }, 20000)

  it('should return true when checking multi factor validator isInstalled', async () => {
    const isMFAInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'validator',
        module: MULTI_FACTOR_VALIDATOR_ADDRESS,
      }),
    })

    expect(isMFAInstalled).toBe(true)
  }, 20000)

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

  it('should return true when checking scheduled orders isInstalled', async () => {
    const isScheduledOrdersInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'executor',
        module: SCHEDULED_ORDERS_EXECUTER_ADDRESS,
      }),
    })

    expect(isScheduledOrdersInstalled).toBe(true)
  }, 20000)

  it('should return true when checking scheduled transfers isInstalled', async () => {
    const isScheduledTransfersInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'executor',
        module: SCHEDULED_TRANSFERS_EXECUTER_ADDRESS,
      }),
    })

    expect(isScheduledTransfersInstalled).toBe(true)
  }, 20000)

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
})
