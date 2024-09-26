import { Address, encodeFunctionData, Hex } from 'viem'
import { ApprovalSpend, CrossChainOrder, WithdrawRequest } from './types'
import { Execution } from 'src/account'
import { accountLockerSourceExecutorAbi } from './abis'
import { ACCOUNT_LOCKER_SOURCE_EXECUTOR } from './constants'

export const getUnlockFundsAction = ({
  account,
  userSignature,
  orchestratorSignature,
  request,
}: {
  account: Address
  userSignature: Hex
  orchestratorSignature: Hex
  request: WithdrawRequest
}): Execution => {
  return {
    target: ACCOUNT_LOCKER_SOURCE_EXECUTOR,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'unlockFunds',
      abi: accountLockerSourceExecutorAbi,
      args: [account, userSignature, orchestratorSignature, request],
    }),
  }
}

export const getDepositToAcrossAction = ({
  account,
  userSignature,
  orchestratorSignature,
  order,
}: {
  account: Address
  userSignature: Hex
  orchestratorSignature: Hex
  order: CrossChainOrder
}): Execution => {
  return {
    target: ACCOUNT_LOCKER_SOURCE_EXECUTOR,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'depositToAcross',
      abi: accountLockerSourceExecutorAbi,
      args: [account, userSignature, orchestratorSignature, order],
    }),
  }
}

export const getRegisterApprovalSpendAction = ({
  approvalSpend,
  orchestratorSignature,
}: {
  approvalSpend: ApprovalSpend
  orchestratorSignature: Hex
}): Execution => {
  return {
    target: ACCOUNT_LOCKER_SOURCE_EXECUTOR,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'registerApprovalSpend',
      abi: accountLockerSourceExecutorAbi,
      args: [approvalSpend, orchestratorSignature],
    }),
  }
}
