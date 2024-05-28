import { installModule } from 'src/account'
import {
  getInstallOwnableValidator,
  getInstallScheduledOrdersExecutor,
  getInstallScheduledTransfersExecutor,
} from 'src/module'
import { Account } from 'src/account'
import { Address, encodePacked, Hex, PublicClient } from 'viem'
import { getInstallOwnableExecuter } from 'src/module/ownable-executer'
import { getInstallSocialRecovery } from 'src/module/social-recovery/installation'
import { REGISTRY_ADDRESS } from 'src/module/registry'
import { getInstallAutoSavingsExecutor } from 'src/module/auto-savings'
import { getInstallDeadmanSwitch } from 'src/module/deadman-switch'
import { REGISTRY_HOOK_ADDRESS } from 'src/module/registry-hook'
import { getInstallMultiFactorValidator } from 'src/module/multi-factor-validator'
import { validators } from 'test/utils/userOps/constants/validators'
import {
  getInstallAllowedCallbackSenders,
  getInstallColdStorageHook,
} from 'src/module/cold-storage'
import { getInstallHookMultiPlexer } from 'src/module/hook-multi-plexer'
import { CallType } from 'src/module/types'

type Params = {
  account: Account
  client: PublicClient
}

export const getInstallModuleActions = async ({ account, client }: Params) => {
  const {
    ownableExecuter,
    ownableValidator,
    socialRecoveryValidator,
    autoSavingExecutor,
    deadmanSwitchValidator,
    multiFactorValidator,
    virtualCodeStorageExecutor,
    allowedCallbackSendersFallback,
    scheduledOrdersExecutor,
    scheduledTransfersExecutor,
    hookMultiPlexer,
  } = getInstallModuleData({
    account,
    client,
  })

  // install ownable validator
  const installOwnableValidatorAction = await installModule({
    client,
    account,
    module: getInstallOwnableValidator(ownableValidator),
  })

  // install ownable executor
  const installOwnableExecutorAction = await installModule({
    client,
    account,
    module: getInstallOwnableExecuter(ownableExecuter),
  })

  // install social recovery
  const installSocialRecoveryAction = await installModule({
    client,
    account,
    module: getInstallSocialRecovery(socialRecoveryValidator),
  })

  // install auto savings executor
  const installAutoSavingsExecutorAction = await installModule({
    client,
    account,
    module: getInstallAutoSavingsExecutor(autoSavingExecutor),
  })

  // install deadman switch validator
  const installDeadmanSwitchValidatorAction = await installModule({
    client,
    account,
    module: getInstallDeadmanSwitch(deadmanSwitchValidator),
  })

  // install multi factor validator
  const installMultiFactorValidatorAction = await installModule({
    client,
    account,
    module: getInstallMultiFactorValidator(multiFactorValidator),
  })

  // install virtual code storage hook
  const installVirtualCodeStorageExecutorAction = await installModule({
    client,
    account,
    module: await getInstallColdStorageHook({
      account,
      client,
      ...virtualCodeStorageExecutor,
    }),
  })

  // install callback senders
  const installCallbackSendersAction = await installModule({
    client,
    account,
    module: getInstallAllowedCallbackSenders(allowedCallbackSendersFallback),
  })

  // install scheduled orders executor
  const installScheduledOrdersExecutorAction = await installModule({
    client,
    account,
    module: getInstallScheduledOrdersExecutor(scheduledOrdersExecutor),
  })

  // install scheduled transfers executor
  const installScheduledTransfersExecutorAction = await installModule({
    client,
    account,
    module: getInstallScheduledTransfersExecutor(scheduledTransfersExecutor),
  })

  // install hook multi plexer
  const installHookMultiplexerAction = await installModule({
    client,
    account,
    module: getInstallHookMultiPlexer(hookMultiPlexer),
  })

  return [
    ...installOwnableValidatorAction,
    ...installOwnableExecutorAction,
    ...installSocialRecoveryAction,
    ...installAutoSavingsExecutorAction,
    ...installDeadmanSwitchValidatorAction,
    ...installMultiFactorValidatorAction,
    ...installVirtualCodeStorageExecutorAction,
    ...installCallbackSendersAction,
    ...installScheduledOrdersExecutorAction,
    ...installScheduledTransfersExecutorAction,
    ...installHookMultiplexerAction,
    // ...installRegistryHookAction,
  ]
}

export const getInstallModuleData = ({ account }: Params) => ({
  ownableValidator: {
    threshold: 1,
    owners: [account.address],
  },
  ownableExecuter: {
    owner: account.address,
  },
  socialRecoveryValidator: {
    threshold: 1,
    guardians: [account.address],
  },
  registryHook: {
    registryAddress: REGISTRY_ADDRESS as Address,
  },
  autoSavingExecutor: {
    tokens: [account.address],
    configs: [
      {
        percentage: 10,
        vault: '0xd921f0dF3B56899F26F658809aaa161cdfC2359F' as Address,
        sqrtPriceLimitX96: BigInt(10),
      },
    ],
  },
  deadmanSwitchValidator: {
    moduleType: 'validator' as any,
    nominee: account.address,
    timeout: 1000,
  },
  multiFactorValidator: {
    threshold: 1,
    validators: [
      {
        packedValidatorAndId: encodePacked(
          ['bytes12', 'address'],
          ['0x000000000000000000000000', validators.ecdsa.address],
        ),
        data: '0x41414141' as Hex,
      },
    ],
  },
  virtualCodeStorageExecutor: {
    waitPeriod: 1000,
    owner: '0x206f270A1eBB6Dd3Bc97581376168014FD6eE57c' as Address,
    moduleType: 'executor' as any,
  },
  allowedCallbackSendersFallback: {
    addresses: [account.address] as Address[],
    selector: '0x00000000' as Hex,
    callType: CallType.CALLTYPE_SINGLE,
  },
  scheduledOrdersExecutor: {
    executeInterval: 100,
    numberOfExecutions: 10,
    startDate: new Date().getTime(),
    executionData: '0x' as Hex,
  },
  scheduledTransfersExecutor: {
    executeInterval: 100,
    numberOfExecutions: 10,
    startDate: new Date().getTime(),
    executionData: '0x' as Hex,
  },
  hookMultiPlexer: {
    globalHooks: [REGISTRY_HOOK_ADDRESS as Address],
    valueHooks: [],
    delegatecallHooks: [],
    sigHooks: [],
    targetHooks: [],
  },
})
