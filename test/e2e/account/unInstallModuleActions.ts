import { uninstallModule } from 'src/account'
import { getModule, OWNABLE_VALIDATOR_ADDRESS } from 'src/module'
import { Account } from 'src/account'
import { PublicClient } from 'viem'
import { OWNABLE_EXECUTER_ADDRESS } from 'src/module/ownable-executer'

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

  return [...unInstallOwnableValidatorAction, ...unInstallOwnableExecutorAction]
}
