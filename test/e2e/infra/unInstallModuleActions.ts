import { uninstallModule } from 'src/account'
import { getModule } from 'src/module'
import { Account } from 'src/account'
import { Hex, PublicClient } from 'viem'
import { SafeHookType } from 'src/account/safe/types'
import { GLOBAL_CONSTANTS } from 'src/constants'

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
      module: GLOBAL_CONSTANTS.OWNABLE_VALIDATOR_ADDRESS,
    }),
  })

  // unInstall webauthn validator
  const unInstallWebAuthnValidatorAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'validator',
      module: GLOBAL_CONSTANTS.WEBAUTHN_VALIDATOR_ADDRESS,
    }),
  })

  // unInstall ownable executor
  const unInstallOwnableExecutorAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'executor',
      module: GLOBAL_CONSTANTS.OWNABLE_EXECUTOR_ADDRESS,
    }),
  })

  // // uninstall social recovery
  const unInstallSocialRecoveryAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'validator',
      module: GLOBAL_CONSTANTS.SOCIAL_RECOVERY_ADDRESS,
    }),
  })

  // // uninstall auto savings executor
  const unInstallAutoSavingsExecutorAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'executor',
      module: GLOBAL_CONSTANTS.AUTO_SAVINGS_ADDRESS,
    }),
  })

  // uninstall deadman switch validator
  const unInstallDeadmanSwitchValidatorAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'validator',
      module: GLOBAL_CONSTANTS.DEADMAN_SWITCH_ADDRESS,
    }),
  })

  // unInstall multi factor validator
  const unInstallMultiFactorValidatorAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'validator',
      module: GLOBAL_CONSTANTS.MULTI_FACTOR_VALIDATOR_ADDRESS,
    }),
  })

  // unInstall virtual code storage executor
  const unInstallVirtualCodeStorageExecutorAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'executor',
      module: GLOBAL_CONSTANTS.COLD_STORAGE_HOOK_ADDRESS,
    }),
  })

  // unInstall virtual code storage fallback
  const unInstallVirtualCodeStorageFallbackAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'fallback',
      module: GLOBAL_CONSTANTS.COLD_STORAGE_FLASHLOAN_ADDRESS,
      functionSig: '0x00000000' as Hex,
      selector: '0x00000000' as Hex,
    }),
  })

  const unInstallScheduledOrdersExecutorAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'executor',
      module: GLOBAL_CONSTANTS.SCHEDULED_ORDERS_EXECUTOR_ADDRESS,
    }),
  })

  const unInstallScheduledTransfersExecutorAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'executor',
      module: GLOBAL_CONSTANTS.SCHEDULED_TRANSFERS_EXECUTOR_ADDRESS,
    }),
  })

  const unInstallHookMultiPlexerHookAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'hook',
      module: GLOBAL_CONSTANTS.HOOK_MULTI_PLEXER_ADDRESS,
      hookType: SafeHookType.GLOBAL,
      selector: '0x00000000' as Hex,
    }),
  })

  const unInstallSmartSessionsValidatorAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'validator',
      module: GLOBAL_CONSTANTS.SMART_SESSIONS_ADDRESS,
    }),
  })

  // unInstall universal email recovery executor
  const unInstallUniversalEmailRecoveryExecutorAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'executor',
      module: GLOBAL_CONSTANTS.UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    }),
  })

  return [
    ...unInstallUniversalEmailRecoveryExecutorAction,
    ...unInstallHookMultiPlexerHookAction,
    ...unInstallScheduledTransfersExecutorAction,
    ...unInstallScheduledOrdersExecutorAction,
    ...unInstallVirtualCodeStorageFallbackAction,
    ...unInstallVirtualCodeStorageExecutorAction,
    ...unInstallMultiFactorValidatorAction,
    ...unInstallDeadmanSwitchValidatorAction,
    ...unInstallAutoSavingsExecutorAction,
    ...unInstallSocialRecoveryAction,
    ...unInstallOwnableExecutorAction,
    ...unInstallWebAuthnValidatorAction,
    ...unInstallOwnableValidatorAction,
    ...unInstallSmartSessionsValidatorAction,
  ]
}
