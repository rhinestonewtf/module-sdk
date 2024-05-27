import { Account } from 'src/account'
import { Hex, parseEther, PublicClient, TestClient } from 'viem'
import { ensureBundlerIsReady } from 'test/utils/healthCheck'
import { getInstallModuleActions } from './installModuleActions'
import { getNetwork } from 'test/utils/userOps/constants/networks'
import { defaultValidator } from 'test/utils/userOps/constants/validators'
import {
  createAndSignUserOp,
  submitUserOpToBundler,
} from 'test/utils/userOps/userOps'
import { sepolia } from 'viem/chains'
import { BundlerClient } from 'permissionless'
import { ENTRYPOINT_ADDRESS_V07 } from 'permissionless'
import * as HelpersModule from 'src/common/getPrevModule'
import { SENTINEL_ADDRESS } from 'src/common/constants'

type Params = {
  account: Account
  publicClient: PublicClient
  testClient: TestClient
  bundlerClient: BundlerClient<typeof ENTRYPOINT_ADDRESS_V07>
}

export const setupEnvironment = async ({
  account,
  publicClient,
  testClient,
  bundlerClient,
}: Params) => {
  await ensureBundlerIsReady()

  jest
    .spyOn(HelpersModule, 'getPreviousModule')
    .mockReturnValue(new Promise((resolve) => resolve(SENTINEL_ADDRESS)))

  // top up account balance
  await testClient.setBalance({
    address: account.address,
    value: parseEther('1'),
  })

  const installAllModulesActions = await getInstallModuleActions({
    account,
    client: publicClient,
  })

  // install all modules
  const userOp = await createAndSignUserOp({
    network: getNetwork(sepolia.id),
    activeAccount: account,
    chosenValidator: defaultValidator,
    actions: installAllModulesActions,
  })

  // submit user op to bundler
  const userOpHash = (await submitUserOpToBundler({
    userOp,
  })) as Hex

  await bundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  })
}
