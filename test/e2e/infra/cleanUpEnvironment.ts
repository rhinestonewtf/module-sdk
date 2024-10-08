import { Account } from 'src/account'
import { PublicClient } from 'viem'
import { getUnInstallModuleActions } from './unInstallModuleActions'
import { sendUserOp } from './sendUserOp'

type Params = {
  account: Account
  client: PublicClient
}

// Clean up the environment by uninstalling all modules
export const cleanUpEnvironment = async ({ account, client }: Params) => {
  console.log('Cleaning up environment...')
  const unInstallAllModulesActions = await getUnInstallModuleActions({
    account,
    client,
  })

  if (unInstallAllModulesActions.length) {
    await sendUserOp({ account, actions: unInstallAllModulesActions })
  }
}
