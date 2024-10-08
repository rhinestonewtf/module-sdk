import { Account } from 'src/account'
import { parseEther, PublicClient, TestClient } from 'viem'
import { ensureBundlerIsReady } from 'test/utils/healthCheck'
import { getInstallModuleActions } from './installModuleActions'
import * as HelpersModule from 'src/common/getPrevModule'
import { SENTINEL_ADDRESS } from 'src/common/constants'
import { sendUserOp } from './sendUserOp'
import {
  getTrustAttestersAction,
  MOCK_ATTESTER_ADDRESS,
  RHINESTONE_ATTESTER_ADDRESS,
} from 'src/module'

type Params = {
  account: Account
  publicClient: PublicClient
  testClient: TestClient
}

export const setupEnvironment = async ({
  account,
  publicClient,
  testClient,
}: Params) => {
  await ensureBundlerIsReady()

  jest
    .spyOn(HelpersModule, 'getPreviousModule')
    .mockReturnValue(new Promise((resolve) => resolve(SENTINEL_ADDRESS)))

  // top up account balance
  await testClient.setBalance({
    address: account.address,
    value: parseEther('2'),
  })

  const installAllModulesActions = await getInstallModuleActions({
    account,
    client: publicClient,
  })

  const batch1 = installAllModulesActions.slice(0, 5)
  const batch2 = installAllModulesActions.slice(5)

  if (batch1.length) {
    await sendUserOp({
      actions: [
        getTrustAttestersAction({
          threshold: 1,
          attesters: [RHINESTONE_ATTESTER_ADDRESS, MOCK_ATTESTER_ADDRESS],
        }),
        ...batch1,
      ],
      account,
    })
  }

  if (batch2.length) {
    await sendUserOp({ actions: batch2, account })
  }
}
