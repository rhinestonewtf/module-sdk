import {
  Hex,
  encodeAbiParameters,
  encodeFunctionData,
  encodePacked,
  pad,
  slice,
} from 'viem'
import {
  UserOperation,
  getAccountNonce,
  getUserOperationHash,
} from 'permissionless'
import {
  Network,
  TransactionDetailsForUserOp,
  Validator,
  createAndSubmitUserOpParams,
} from './types'
import { getBundlerClient, getPublicClient } from './clients'
import { AccountAbi } from './constants/abis/Account'
import { ENTRY_POINT_ADDRESS } from './constants/contracts'
import { defaultValidator } from './constants/validators'
import { EntryPoint } from 'permissionless/types'
import { Account } from 'src/account'

const CALL_TYPE = {
  SINGLE: '0x0000000000000000000000000000000000000000000000000000000000000000',
  BATCH: '0x0100000000000000000000000000000000000000000000000000000000000000',
}

export async function createAndSignUserOp({
  actions,
  network,
  activeAccount,
  chosenValidator,
}: createAndSubmitUserOpParams) {
  const validator = chosenValidator || defaultValidator
  const op = await createUnsignedUserOp(
    {
      actions,
    },
    network,
    activeAccount,
    validator,
  )
  return await signUserOp(op, network, activeAccount, validator)
}

async function createUnsignedUserOp(
  info: TransactionDetailsForUserOp,
  network: Network,
  activeAccount: Account,
  chosenValidator: Validator,
): Promise<UserOperation<'v0.7'>> {
  const callData = await encodeUserOpCallData(info)
  const initCode = await getUserOpInitCode(network, activeAccount)

  const nonce = await getNonce({
    activeAccount,
    chosenValidator,
  })

  const partialUserOp: UserOperation<'v0.7'> = {
    sender: activeAccount.address,
    nonce: nonce,
    factory: initCode == '0x' ? undefined : slice(initCode, 0, 20),
    factoryData: initCode == '0x' ? undefined : slice(initCode, 20),
    callData: callData,
    // @dev mock signature used for estimating gas
    signature: chosenValidator.mockSignature,
    callGasLimit: BigInt(0),
    verificationGasLimit: BigInt(0),
    preVerificationGas: BigInt(0),
    maxFeePerGas: BigInt(0),
    maxPriorityFeePerGas: BigInt(0),
  }

  const bundlerClient = getBundlerClient()
  const gasPriceResult = await bundlerClient.getUserOperationGasPrice()
  partialUserOp.maxFeePerGas = gasPriceResult.standard.maxFeePerGas
  partialUserOp.maxPriorityFeePerGas =
    gasPriceResult.standard.maxPriorityFeePerGas

  const gasEstimate = await bundlerClient.estimateUserOperationGas({
    userOperation: partialUserOp,
  })

  partialUserOp.preVerificationGas = gasEstimate.preVerificationGas
  partialUserOp.verificationGasLimit = gasEstimate.verificationGasLimit
  partialUserOp.callGasLimit = gasEstimate.callGasLimit

  // reset signature
  partialUserOp.signature = '0x'

  return {
    ...partialUserOp,
  }
}

async function signUserOp(
  userOp: UserOperation<'v0.7'>,
  network: Network,
  activeAccount: Account,
  chosenValidator: Validator,
): Promise<UserOperation<'v0.7'>> {
  const userOpHash = getUserOperationHash({
    userOperation: userOp,
    chainId: network.id,
    entryPoint: ENTRY_POINT_ADDRESS as EntryPoint,
  })
  const signature = await chosenValidator.signMessageAsync(
    userOpHash,
    activeAccount,
  )
  userOp.signature = signature
  return userOp
}

export async function submitUserOpToBundler({
  userOp,
}: {
  userOp: UserOperation<'v0.7'>
}): Promise<string> {
  const bundlerClient = getBundlerClient()
  return await bundlerClient.sendUserOperation({
    userOperation: userOp,
  })
}

const getNonce = async ({
  activeAccount,
  chosenValidator,
}: {
  activeAccount: Account
  chosenValidator: Validator
}) => {
  const publicClient = getPublicClient()
  const nonce = await getAccountNonce(publicClient, {
    sender: activeAccount.address,
    entryPoint: ENTRY_POINT_ADDRESS as EntryPoint,
    key: BigInt(
      pad(chosenValidator.address, {
        dir: 'right',
        size: 24,
      }),
    ),
  })

  return nonce
}

async function encodeUserOpCallData(
  detailsForUserOp: TransactionDetailsForUserOp,
): Promise<Hex> {
  const actions = detailsForUserOp.actions
  if (actions.length === 0) {
    throw new Error('No actions')
  } else if (actions.length === 1) {
    const { target, value, callData } = actions[0]
    return encodeFunctionData({
      functionName: 'execute',
      abi: AccountAbi.abi,
      args: [
        CALL_TYPE.SINGLE,
        encodePacked(
          ['address', 'uint256', 'bytes'],
          [target, BigInt(Number(value)), callData],
        ),
      ],
    })
  } else {
    return encodeFunctionData({
      functionName: 'execute',
      abi: AccountAbi.abi,
      args: [
        CALL_TYPE.BATCH,
        encodeAbiParameters(
          [
            {
              components: [
                {
                  name: 'target',
                  type: 'address',
                },
                {
                  name: 'value',
                  type: 'uint256',
                },
                {
                  name: 'callData',
                  type: 'bytes',
                },
              ],
              name: 'Execution',
              type: 'tuple[]',
            },
          ],
          // @ts-ignore
          [actions],
        ),
      ],
    })
  }
}

async function getUserOpInitCode(
  network: Network,
  account: Account,
): Promise<Hex> {
  if ((await isContract(network, account)) == false) {
    return account.initCode!
  }
  return '0x'
}

async function isContract(
  network: Network,
  account: Account,
): Promise<boolean> {
  if (account.deployedOnChains.includes(network.id)) {
    return true
  }

  const publicClient = getPublicClient()
  const code = await publicClient.getBytecode({ address: account.address })
  return code !== undefined
}
