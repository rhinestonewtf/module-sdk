import { Account } from 'src/account'
import { getBundlerClient } from 'test/utils/userOps/clients'
import { getNetwork } from 'test/utils/userOps/constants/networks'
import { defaultValidator } from 'test/utils/userOps/constants/validators'
import { ExecuteAction } from 'test/utils/userOps/types'
import {
  createAndSignUserOp,
  submitUserOpToBundler,
} from 'test/utils/userOps/userOps'
import { Hex } from 'viem'
import { sepolia } from 'viem/chains'

type SendUserOpParams = {
  account: Account
  actions: ExecuteAction[]
}
export const sendUserOp = async ({ account, actions }: SendUserOpParams) => {
  const bundlerClient = getBundlerClient()

  const userOp = await createAndSignUserOp({
    network: getNetwork(sepolia.id),
    activeAccount: account,
    chosenValidator: defaultValidator,
    actions,
  })

  const userOpHash = (await submitUserOpToBundler({
    userOp,
  })) as Hex

  const receipt = await bundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  })

  return receipt
}
