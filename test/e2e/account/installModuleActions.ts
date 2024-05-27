import { installModule } from 'src/account'
import { getInstallOwnableValidator } from 'src/module'
import { Account } from 'src/account'
import { Address, encodePacked, Hex, PublicClient } from 'viem'
import { getInstallOwnableExecuter } from 'src/module/ownable-executer'
import { getInstallSocialRecovery } from 'src/module/social-recovery/installation'
import { REGISTRY_ADDRESS } from 'src/module/registry'
import { getInstallAutoSavingsExecutor } from 'src/module/auto-savings'
import { getInstallDeadmanSwitch } from 'src/module/deadman-switch'
import { getInstallRegistryHook } from 'src/module/registry-hook'
import { getInstallMultiFactorValidator } from 'src/module/multi-factor-validator'
import { validators } from 'test/utils/userOps/constants/validators'

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
    registryHook,
    multiFactorValidator,
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

  console.log('installOwnableValidatorAction', installOwnableValidatorAction)

  // install ownable executor
  const installOwnableExecutorAction = await installModule({
    client,
    account,
    module: getInstallOwnableExecuter(ownableExecuter),
  })

  console.log('installOwnableExecutorAction', installOwnableExecutorAction)

  // install social recovery
  const installSocialRecoveryAction = await installModule({
    client,
    account,
    module: getInstallSocialRecovery(socialRecoveryValidator),
  })

  console.log('installSocialRecoveryAction', installSocialRecoveryAction)

  // install auto savings executor
  const installAutoSavingsExecutorAction = await installModule({
    client,
    account,
    module: getInstallAutoSavingsExecutor(autoSavingExecutor),
  })

  console.log(
    'installAutoSavingsExecutorAction',
    installAutoSavingsExecutorAction,
  )

  // install deadman switch validator
  const installDeadmanSwitchValidatorAction = await installModule({
    client,
    account,
    module: getInstallDeadmanSwitch(deadmanSwitchValidator),
  })

  console.log(
    'installDeadmanSwitchValidatorAction',
    installDeadmanSwitchValidatorAction,
  )

  // install registry hook
  const installRegistryHookAction = await installModule({
    client,
    account,
    module: getInstallRegistryHook(registryHook),
  })

  console.log('installRegistryHookAction', installRegistryHookAction)

  // install multi factor validator
  const installMultiFactorValidatorAction = await installModule({
    client,
    account,
    module: getInstallMultiFactorValidator(multiFactorValidator),
  })

  console.log(
    'installMultiFactorValidatorAction',
    installMultiFactorValidatorAction,
  )

  return [
    ...installOwnableValidatorAction,
    ...installOwnableExecutorAction,
    ...installSocialRecoveryAction,
    ...installAutoSavingsExecutorAction,
    ...installDeadmanSwitchValidatorAction,
    ...installMultiFactorValidatorAction,
    ...installRegistryHookAction,
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
})
