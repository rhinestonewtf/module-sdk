import { getAccount } from 'src/account'
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
import { MockAccountDeployed } from 'test/utils/mocks/account'

describe('Omni Account Module', () => {
  it('should get install account locker hook', async () => {
    const installAccountLockerHook = getAccountLockerHook()

    expect(installAccountLockerHook.module).toEqual(ACCOUNT_LOCKER_HOOK)
    expect(installAccountLockerHook.initData).toBeDefined()
    expect(installAccountLockerHook.type).toEqual('hook')
  })
  it('should get install account locker source executor', async () => {
    const installAccountLockerSourceExecutor = getAccountLockerSourceExecutor()

    expect(installAccountLockerSourceExecutor.module).toEqual(
      ACCOUNT_LOCKER_SOURCE_EXECUTOR,
    )
    expect(installAccountLockerSourceExecutor.initData).toEqual('0x')
    expect(installAccountLockerSourceExecutor.type).toEqual('executor')
  })
  it('should get install account locker target executor', async () => {
    const installAccountLockerTargetExecutor = getAccountLockerTargetExecutor()

    expect(installAccountLockerTargetExecutor.module).toEqual(
      ACCOUNT_LOCKER_TARGET_EXECUTOR,
    )
    expect(installAccountLockerTargetExecutor.initData).toEqual('0x')
    expect(installAccountLockerTargetExecutor.type).toEqual('executor')
  })
  it('should get the unlock funds action', async () => {
    const unlockFunds = getUnlockFundsAction({
      orchestratorSignature: '0x',
      request: {
        timestamp: Date.now(),
        tokenAddress: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
        orchestrator: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
        amount: BigInt(100),
        nonce: BigInt(1),
      },
    })

    expect(unlockFunds.target).toEqual(ACCOUNT_LOCKER_SOURCE_EXECUTOR)
    expect(unlockFunds.value).toEqual(BigInt(0))
    expect(unlockFunds.callData).toBeDefined()
  })
  it('should get the deposit to across action', async () => {
    const depositToAcross = getDepositToAcrossAction({
      account: MockAccountDeployed.address,
      userSignature: '0x',
      orchestratorSignature: '0x',
      order: {
        settlementContract: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
        swapper: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
        nonce: BigInt(1),
        originChainId: 1,
        initiateDeadline: Date.now() + 1000,
        fillDeadline: Date.now() + 2000,
        orderData: '0x',
      },
    })

    expect(depositToAcross.target).toEqual(ACCOUNT_LOCKER_SOURCE_EXECUTOR)
    expect(depositToAcross.value).toEqual(BigInt(0))
    expect(depositToAcross.callData).toBeDefined()
  })
  it('should get the register approval spend action', async () => {
    const registerApprovalSpend = getRegisterApprovalSpendAction({
      approvalSpend: {
        account: MockAccountDeployed.address,
        token: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
        amount: BigInt(100),
      },
      orchestratorSignature: '0x',
    })

    expect(registerApprovalSpend.target).toEqual(ACCOUNT_LOCKER_SOURCE_EXECUTOR)
    expect(registerApprovalSpend.value).toEqual(BigInt(0))
    expect(registerApprovalSpend.callData).toBeDefined()
  })
})
