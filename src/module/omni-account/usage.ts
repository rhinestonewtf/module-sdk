import { encodeFunctionData, Hex } from 'viem'
import { accountLockerSourceExecutorAbi } from './abis'
import { ACCOUNT_LOCKER_SOURCE_EXECUTOR } from './constants'
import { ApprovalSpend, OriginModulePayload, WithdrawRequest } from './types'
import { Execution } from '../../account'

export const getUnlockFundsAction = ({
  orchestratorSignature,
  request,
}: {
  orchestratorSignature: Hex
  request: WithdrawRequest
}): Execution => {
  const data = encodeFunctionData({
    functionName: 'unlockFundsForAccount',
    abi: accountLockerSourceExecutorAbi,
    args: [orchestratorSignature, request],
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
  originModulePayload,
}: {
  originModulePayload: OriginModulePayload
}): Execution => {
  const data = encodeFunctionData({
    functionName: 'handleAcross',
    abi: accountLockerSourceExecutorAbi,
    args: [originModulePayload],
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
