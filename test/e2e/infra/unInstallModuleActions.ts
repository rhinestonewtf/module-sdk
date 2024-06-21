import { uninstallModule } from 'src'
import {
  getModule,
  OWNABLE_VALIDATOR_ADDRESS,
  SCHEDULED_ORDERS_EXECUTER_ADDRESS,
  SCHEDULED_TRANSFERS_EXECUTER_ADDRESS,
} from 'src'
import { Account } from 'src'
import { Hex, PublicClient } from 'viem'
import { OWNABLE_EXECUTER_ADDRESS } from 'src'
import { SOCIAL_RECOVERY_ADDRESS } from 'src'
import { AUTO_SAVINGS_ADDRESS } from 'src'
import { COLD_STORAGE_FLASHLOAN_ADDRESS, COLD_STORAGE_HOOK_ADDRESS } from 'src'
import { SafeHookType } from 'src'
import { HOOK_MULTI_PLEXER_ADDRESS } from 'src'
import { DEADMAN_SWITCH_ADDRESS } from 'src'
import { MULTI_FACTOR_VALIDATOR_ADDRESS } from 'src'

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

  // unInstall ownable executor
  const unInstallOwnableExecutorAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'executor',
      module: OWNABLE_EXECUTER_ADDRESS,
    }),
  })

  // // uninstall social recovery
  const unInstallSocialRecoveryAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'validator',
      module: SOCIAL_RECOVERY_ADDRESS,
    }),
  })

  // // uninstall auto savings executor
  const unInstallAutoSavingsExecutorAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'executor',
      module: AUTO_SAVINGS_ADDRESS,
    }),
  })

  // uninstall deadman switch validator
  const unInstallDeadmanSwitchValidatorAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'validator',
      module: DEADMAN_SWITCH_ADDRESS,
    }),
  })

  // unInstall multi factor validator
  const unInstallMultiFactorValidatorAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'validator',
      module: MULTI_FACTOR_VALIDATOR_ADDRESS,
    }),
  })

  // unInstall virtual code storage executor
  const unInstallVirtualCodeStorageExecutorAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'executor',
      module: COLD_STORAGE_HOOK_ADDRESS,
    }),
  })

  // unInstall virtual code storage fallback
  const unInstallVirtualCodeStorageFallbackAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'fallback',
      module: COLD_STORAGE_FLASHLOAN_ADDRESS,
      functionSig: '0x00000000' as Hex,
      selector: '0x00000000' as Hex,
    }),
  })

  const unInstallScheduledOrdersExecutorAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'executor',
      module: SCHEDULED_ORDERS_EXECUTER_ADDRESS,
    }),
  })

  const unInstallScheduledTransfersExecutorAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'executor',
      module: SCHEDULED_TRANSFERS_EXECUTER_ADDRESS,
    }),
  })

  const unInstallHookMultiPlexerHookAction = await uninstallModule({
    client,
    account,
    module: getModule({
      type: 'hook',
      module: HOOK_MULTI_PLEXER_ADDRESS,
      hookType: SafeHookType.GLOBAL,
      selector: '0x00000000' as Hex,
    }),
  })

  return [
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
    ...unInstallOwnableValidatorAction,
  ]
}
