import { installModule } from 'src/account'
import { getInstallOwnableValidator } from 'src/module'
import { Account } from 'src/account'
import { Address, PublicClient } from 'viem'
import { getInstallOwnableExecuter } from 'src/module/ownable-executer'
import { REGISTRY_ADDRESS } from 'src/module/registry'

type Params = {
  account: Account
  client: PublicClient
}

export const getInstallModuleActions = async ({ account, client }: Params) => {
  const { ownableValidator, ownableExecuter } = getInstallModuleData({
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

  return [...installOwnableValidatorAction, ...installOwnableExecutorAction]
}

export const getInstallModuleData = ({ account }: Params) => ({
  ownableValidator: {
    threshold: 1,
    owners: [account.address],
  },
  ownableExecuter: {
    owner: account.address,
  },
  registryHook: {
    registryAddress: REGISTRY_ADDRESS as Address,
  },
})
