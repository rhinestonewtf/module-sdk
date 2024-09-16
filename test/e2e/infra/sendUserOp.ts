import { Account } from 'src/account'
import { getPublicClient } from 'test/utils/userOps/clients'
import { ExecuteAction } from 'test/utils/userOps/types'
import { getNonce, getSmartClient } from '../../utils/userOps/smartClients'
import { Address, Hex } from 'viem'
import { ENTRYPOINT_ADDRESS_V07, getUserOperationHash } from 'permissionless'
import { sepolia } from 'viem/chains'

type SendUserOpParams = {
  actions: ExecuteAction[]
  account: Account
  validator?: Address
  signUserOpHash?: (userOpHash: Hex) => Promise<Hex>
  getDummySignature?: () => Promise<Hex>
}
export const sendUserOp = async ({
  actions,
  account,
  validator,
  signUserOpHash,
  getDummySignature,
}: SendUserOpParams) => {
  const publicClient = getPublicClient()
  const smartClient = await getSmartClient(account)
  const nonce = await getNonce({ account, publicClient, validator })

  if (signUserOpHash) {
    smartClient.account.signUserOperation = async (userOp): Promise<Hex> => {
      const hash = getUserOperationHash({
        userOperation: userOp,
        chainId: sepolia.id,
        entryPoint: ENTRYPOINT_ADDRESS_V07,
      })

      return signUserOpHash(hash)
    }
  }

  if (getDummySignature) {
    smartClient.account.getDummySignature = async (): Promise<Hex> => {
      return getDummySignature()
    }
  }

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
