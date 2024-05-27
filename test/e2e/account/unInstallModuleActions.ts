import { uninstallModule } from 'src/account'
import { getModule, OWNABLE_VALIDATOR_ADDRESS } from 'src/module'
import { Account } from 'src/account'
import { PublicClient } from 'viem'
import { OWNABLE_EXECUTER_ADDRESS } from 'src/module/ownable-executer'
import { REGISTRY_HOOK_ADDRESS } from 'src/module/registry-hook'
import { SOCIAL_RECOVERY_ADDRESS } from 'src/module/social-recovery/constants'
import { AUTO_SAVINGS_ADDRESS } from 'src/module/auto-savings'
import { DEADMAN_SWITCH_ADDRESS } from 'src/module/deadman-switch'
import { MULTI_FACTOR_VALIDATOR_ADDRESS } from 'src/module/multi-factor-validator'

type Params = {
  account: Account
  client: PublicClient
}

export const getUnInstallModuleActions = async ({
  account,
  client,
}: Params) => {
  // unInstall ownable validator
  const unInstallOwnableValidatorAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'validator',
      module: OWNABLE_VALIDATOR_ADDRESS,
    }),
  })

  console.log(
    'unInstallOwnableValidatorAction',
    unInstallOwnableValidatorAction,
  )

  // unInstall ownable executor
  const unInstallOwnableExecutorAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'executor',
      module: OWNABLE_EXECUTER_ADDRESS,
    }),
  })

  console.log('unInstallOwnableExecutorAction', unInstallOwnableExecutorAction)

  // uninstall social recovery
  const unInstallSocialRecoveryAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'validator',
      module: SOCIAL_RECOVERY_ADDRESS,
    }),
  })

  console.log('unInstallSocialRecoveryAction', unInstallSocialRecoveryAction)

  // uninstall auto savings executor
  const unInstallAutoSavingsExecutorAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'executor',
      module: AUTO_SAVINGS_ADDRESS,
    }),
  })

  console.log(
    'unInstallAutoSavingsExecutorAction',
    unInstallAutoSavingsExecutorAction,
  )

  // uninstall deadman switch validator
  const unInstallDeadmanSwitchValidatorAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'validator',
      module: DEADMAN_SWITCH_ADDRESS,
    }),
  })

  console.log(
    'unInstallDeadmanSwitchValidatorAction',
    unInstallDeadmanSwitchValidatorAction,
  )

  // unInstall registry hook
  const unInstallRegistryHookAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'hook',
      module: REGISTRY_HOOK_ADDRESS,
    }),
  })

  console.log('unInstallRegistryHookAction', unInstallRegistryHookAction)

  // unInstall multi factor validator
  const unInstallMultiFactorValidatorAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'validator',
      module: MULTI_FACTOR_VALIDATOR_ADDRESS,
    }),
  })

  console.log(
    'unInstallMultiFactorValidatorAction',
    unInstallMultiFactorValidatorAction,
  )

  return [
    ...unInstallRegistryHookAction,
    ...unInstallMultiFactorValidatorAction,
    ...unInstallDeadmanSwitchValidatorAction,
    ...unInstallAutoSavingsExecutorAction,
    ...unInstallSocialRecoveryAction,
    ...unInstallOwnableExecutorAction,
    ...unInstallOwnableValidatorAction,
  ]
}
