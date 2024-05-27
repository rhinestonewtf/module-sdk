import { Account } from 'src/account'
import { Hex, PublicClient } from 'viem'
import { ensureBundlerIsReady } from 'test/utils/healthCheck'
import { getNetwork } from 'test/utils/userOps/constants/networks'
import { defaultValidator } from 'test/utils/userOps/constants/validators'
import {
  createAndSignUserOp,
  submitUserOpToBundler,
} from 'test/utils/userOps/userOps'
import { sepolia } from 'viem/chains'
import { BundlerClient } from 'permissionless'
import { ENTRYPOINT_ADDRESS_V07 } from 'permissionless'
import { getUnInstallModuleActions } from './unInstallModuleActions'

type Params = {
  account: Account
  client: PublicClient
  bundlerClient: BundlerClient<typeof ENTRYPOINT_ADDRESS_V07>
}

// Clean up the environment by uninstalling all modules

export const cleanUpEnvironment = async ({
  account,
  client,
  bundlerClient,
}: Params) => {
  await ensureBundlerIsReady()

  const unInstallAllModulesActions = await getUnInstallModuleActions({
    account,
    client,
  })

  // uninstall all modules
  const userOp = await createAndSignUserOp({
    network: getNetwork(sepolia.id),
    activeAccount: account,
    chosenValidator: defaultValidator,
    actions: unInstallAllModulesActions,
  })

  // submit user op to bundler
  const userOpHash = (await submitUserOpToBundler({
    userOp,
  })) as Hex

  await bundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  })
}
