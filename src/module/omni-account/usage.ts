import { Address, encodeFunctionData, Hex } from 'viem'
import { accountLockerSourceExecutorAbi } from './abis'
import { ACCOUNT_LOCKER_SOURCE_EXECUTOR } from './constants'
import { ApprovalSpend, CrossChainOrder, WithdrawRequest } from './types'
import { Execution } from '../../account'

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
  const data = encodeFunctionData({
    functionName: 'unlockFunds',
    abi: accountLockerSourceExecutorAbi,
    args: [account, userSignature, orchestratorSignature, request],
  })

  return {
    to: ACCOUNT_LOCKER_SOURCE_EXECUTOR,
    target: ACCOUNT_LOCKER_SOURCE_EXECUTOR,
    value: BigInt(0),
    data,
    callData: data,
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
  const data = encodeFunctionData({
    functionName: 'depositToAcross',
    abi: accountLockerSourceExecutorAbi,
    args: [account, userSignature, orchestratorSignature, order],
  })
  return {
    to: ACCOUNT_LOCKER_SOURCE_EXECUTOR,
    target: ACCOUNT_LOCKER_SOURCE_EXECUTOR,
    value: BigInt(0),
    data,
    callData: data,
  }
}

export const getRegisterApprovalSpendAction = ({
  approvalSpend,
  orchestratorSignature,
}: {
  approvalSpend: ApprovalSpend
  orchestratorSignature: Hex
}): Execution => {
  const data = encodeFunctionData({
    functionName: 'registerApprovalSpend',
    abi: accountLockerSourceExecutorAbi,
    args: [approvalSpend, orchestratorSignature],
  })
  return {
    to: ACCOUNT_LOCKER_SOURCE_EXECUTOR,
    target: ACCOUNT_LOCKER_SOURCE_EXECUTOR,
    value: BigInt(0),
    data,
    callData: data,
  }
}
