import {
  ACCOUNT_LOCKER_HOOK,
  ACCOUNT_LOCKER_SOURCE_EXECUTOR,
  ACCOUNT_LOCKER_TARGET_EXECUTOR,
  getAccountLockerHook,
  getAccountLockerSourceExecutor,
  getAccountLockerTargetExecutor,
  getDepositToAcrossAction,
  getRegisterApprovalSpendAction,
  getUnlockFundsAction,
} from 'src/module'

import { getAccount } from 'src'
import { MockAccountDeployed } from '../../../utils/mocks/account'

describe('Account locker Modules', () => {
  // Setup
  const account = getAccount(MockAccountDeployed)

  it('should get install account locker hook module', async () => {
    const lockerHookModule = getAccountLockerHook()

    expect(lockerHookModule.module).toEqual(ACCOUNT_LOCKER_HOOK)
    expect(lockerHookModule.initData).toBeDefined()
    expect(lockerHookModule.type).toEqual('hook')
  })

  it('should get install account locker source executor module', async () => {
    const lockerSourceExecutorModule = getAccountLockerSourceExecutor()

    expect(lockerSourceExecutorModule.module).toEqual(
      ACCOUNT_LOCKER_SOURCE_EXECUTOR,
    )
    expect(lockerSourceExecutorModule.initData).toBeDefined()
    expect(lockerSourceExecutorModule.type).toEqual('executor')
  })

  it('should get install account locker target executor module', async () => {
    const lockerTargetExecutorModule = getAccountLockerTargetExecutor()

    expect(lockerTargetExecutorModule.module).toEqual(
      ACCOUNT_LOCKER_TARGET_EXECUTOR,
    )
    expect(lockerTargetExecutorModule.initData).toBeDefined()
    expect(lockerTargetExecutorModule.type).toEqual('executor')
  })

  it('should get unlockFunds action', async () => {
    const unlockFundsAction = getUnlockFundsAction({
      account: account.address,
      userSignature: '0x0',
      orchestratorSignature: '0x0',
      request: {
        amount: BigInt(100),
        nonce: BigInt(0),
        orchestrator: account.address,
        timestamp: 100,
        tokenAddress: account.address,
      },
    })

    expect(unlockFundsAction.target).toEqual(ACCOUNT_LOCKER_SOURCE_EXECUTOR)
    expect(unlockFundsAction.value).toEqual(BigInt(0))
    expect(unlockFundsAction.callData).toBeDefined()
  })

  it('should get depositToAcross action', async () => {
    const depositToAcrossAction = getDepositToAcrossAction({
      account: account.address,
      userSignature: '0x0',
      orchestratorSignature: '0x0',
      order: {
        fillDeadline: 100,
        nonce: BigInt(0),
        initiateDeadline: 100,
        orderData: '0x0',
        originChainId: 1,
        settlementContract: account.address,
        swapper: account.address,
      },
    })

    expect(depositToAcrossAction.target).toEqual(ACCOUNT_LOCKER_SOURCE_EXECUTOR)
    expect(depositToAcrossAction.value).toEqual(BigInt(0))
    expect(depositToAcrossAction.callData).toBeDefined()
  })

  it('should get registerApprovalSpend action', async () => {
    const registerApprovalSpendAction = getRegisterApprovalSpendAction({
      approvalSpend: {
        account: account.address,
        amount: BigInt(100),
        token: account.address,
      },
      orchestratorSignature: '0x0',
    })

    expect(registerApprovalSpendAction.target).toEqual(
      ACCOUNT_LOCKER_SOURCE_EXECUTOR,
    )
    expect(registerApprovalSpendAction.value).toEqual(BigInt(0))
    expect(registerApprovalSpendAction.callData).toBeDefined()
  })
})
