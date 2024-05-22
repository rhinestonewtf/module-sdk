import {
  ensureBundlerIsReady,
  ensurePaymasterIsReady,
} from 'test/utils/healthCheck'
import { sepolia } from 'viem/chains'

import { getNetwork } from 'test/utils/userOps/constants/networks'
import { getAccount } from 'test/utils/userOps/account'
import { defaultValidator } from 'test/utils/userOps/constants/validators'
import {
  createAndSignUserOp,
  submitUserOpToBundler,
} from 'test/utils/userOps/userOps'

import { getBundlerClient, getTestClient } from 'test/utils/userOps/clients'
import { parseEther } from 'viem'

describe('Test basic bundler functions', () => {
  // @ts-ignore
  let bundlerClient: any, testClient: any

  const ERC7579_ACCOUNT = '0xCA83633a0F6582b5bb2cDBC63E151d41999d7D47'

  beforeAll(async () => {
    await ensureBundlerIsReady()
    await ensurePaymasterIsReady()

    bundlerClient = getBundlerClient()
    testClient = getTestClient()
  })

  it('should be able to create and submit user Op', async () => {
    // top up account balance
    await testClient.setBalance({
      address: ERC7579_ACCOUNT,
      value: parseEther('1'),
    })

    // create and sign user op
    const userOp = await createAndSignUserOp({
      network: getNetwork(sepolia.id),
      activeAccount: getAccount({
        address: ERC7579_ACCOUNT,
      }),
      chosenValidator: defaultValidator,
      actions: [
        {
          target: '0xCA83633a0F6582b5bb2cDBC63E151d41999d7D47',
          value: BigInt(0),
          callData: '0x',
        },
      ],
    })

    // submit user op to bundler
    const userOpHash = await submitUserOpToBundler({
      userOp,
    })

    const receipt = await bundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    })

    expect(userOpHash).toBeDefined()
    expect(receipt.success).toEqual(true)
  }, 10000)
})
