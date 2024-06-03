import { installModule } from 'src/account'
import {
  getInstallOwnableValidator,
  getInstallScheduledOrdersExecutor,
  getInstallScheduledTransfersExecutor,
} from 'src/module'
import { Account } from 'src/account'
import { Address, encodePacked, Hex, PublicClient, zeroAddress } from 'viem'
import { CallType } from 'src/module/types'
import { validators } from 'test/utils/userOps/constants/validators'
import { REGISTRY_ADDRESS } from 'src/module/registry'
import { SafeHookType } from 'src/account/safe/types'
import { getInstallOwnableExecuter } from 'src/module/ownable-executer'
import { getInstallSocialRecovery } from 'src/module/social-recovery/installation'
import { getInstallAutoSavingsExecutor } from 'src/module/auto-savings'
import {
  getInstallAllowedCallbackSenders,
  getInstallColdStorageHook,
} from 'src/module/cold-storage'
import { getInstallHookMultiPlexer } from 'src/module/hook-multi-plexer'
import { getInstallDeadmanSwitch } from 'src/module/deadman-switch'
import { getInstallMultiFactorValidator } from 'src/module/multi-factor-validator'

type Params = {
  account: Account
  client: PublicClient
}

export const getInstallModuleActions = async ({ account, client }: Params) => {
  const {
    // ownableExecuter,
    ownableValidator,
    ownableExecuter,
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

  // // install scheduled orders executor
  const installScheduledOrdersExecutorAction = await installModule({
    client,
    account,
    module: getInstallScheduledOrdersExecutor(scheduledOrdersExecutor),
  })

  // // install scheduled transfers executor
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
  ]
}

export const getInstallModuleData = ({ account }: Pick<Params, 'account'>) => ({
  ownableValidator: {
    threshold: 1,
    owners: [account.address],
    hook: zeroAddress,
  },
  ownableExecuter: {
    owner: account.address,
    hook: zeroAddress,
  },
  socialRecoveryValidator: {
    threshold: 1,
    guardians: [account.address],
    hook: zeroAddress,
  },
  registryHook: {
    registryAddress: REGISTRY_ADDRESS as Address,
  },
  autoSavingExecutor: {
    tokens: ['0x96C9b8422f930a4a47c1e3df01103A282ee6EE04' as Address],
    configs: [
      {
        percentage: 10 * 100,
        vault: '0xd921f0dF3B56899F26F658809aaa161cdfC2359F' as Address,
        sqrtPriceLimitX96: BigInt(10),
      },
    ],
    hook: zeroAddress,
  },
  deadmanSwitchValidator: {
    moduleType: 'validator' as any,
    nominee: account.address,
    timeout: 1000,
    hook: zeroAddress,
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
    hook: zeroAddress,
  },
  virtualCodeStorageExecutor: {
    waitPeriod: 1000,
    owner: '0x206f270A1eBB6Dd3Bc97581376168014FD6eE57c' as Address,
    moduleType: 'executor' as any,
    hook: zeroAddress,
  },
  allowedCallbackSendersFallback: {
    addresses: [account.address] as Address[],
    functionSig: '0x00000000' as Hex,
    selector: '0x00000000' as Hex,
    hook: zeroAddress,
    callType: CallType.CALLTYPE_SINGLE,
  },
  scheduledOrdersExecutor: {
    executeInterval: 100,
    numberOfExecutions: 10,
    startDate: new Date().getTime(),
    executionData: '0x' as Hex,
    hook: zeroAddress,
  },
  scheduledTransfersExecutor: {
    executeInterval: 100,
    numberOfExecutions: 10,
    startDate: new Date().getTime(),
    executionData: '0x' as Hex,
    hook: zeroAddress,
  },
  hookMultiPlexer: {
    globalHooks: [],
    valueHooks: [],
    delegatecallHooks: [],
    targetHooks: [],
    sigHooks: [],
    selector: '0x00000000' as Hex,
    hookType: SafeHookType.GLOBAL,
  },
})
