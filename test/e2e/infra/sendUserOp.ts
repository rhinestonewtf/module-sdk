import { Account } from 'src/account'
import { getPublicClient } from 'test/utils/userOps/clients'
import { ExecuteAction } from 'test/utils/userOps/types'
import { getNonce, getSmartClient } from '../../utils/userOps/smartClients'

type SendUserOpParams = {
  actions: ExecuteAction[]
  account: Account
}
export const sendUserOp = async ({ actions, account }: SendUserOpParams) => {
  const publicClient = getPublicClient()
  const smartClient = await getSmartClient(account)
  const nonce = await getNonce({ account, publicClient })

  const hash = await smartClient.sendTransactions({
    account: smartClient.account!,
    transactions: actions.map((action) => ({
      to: action.target,
      data: action.callData,
      value: action.value as bigint,
    })),
    nonce,
  })

  return hash
}
