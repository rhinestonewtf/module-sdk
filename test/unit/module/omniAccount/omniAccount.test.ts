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
        timestamp: Math.floor(Date.now() / 1000),
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
      originModulePayload: {
        order: {
          settlement: {
            orchestrator: '0x8a310b9085faF5d9464D84C3d9a7BE3b28c94531',
            recipient: '0xFfF799094Ede20f26d06A6Ff9bFDca13AD260018',
            settlementContract: '0x634341C2FCa77A82F3885e2cB28C5f068bbB4788',
            lastDepositId:
              BigInt(
                37067938379779921880355465646938906079222528935573724150604866268218749224547,
              ),
            targetChainId: 8453,
            targetAccount: '0xFfF799094Ede20f26d06A6Ff9bFDca13AD260018',
            fillDeadline: 1733491631,
          },
          acrossTransfer: {
            originModule: '0x868E00ae42214a5a1BB2d01aE1587c8814cF45BB',
            originAccount: '0xFfF799094Ede20f26d06A6Ff9bFDca13AD260018',
            originChainId: 42161,
            initiateDeadline: 1733493431,
            maxFee: BigInt(0),
            depositId:
              BigInt(
                37067938379779921880355465646938906079222528935573724150604866268218749224547,
              ),
            originTransfer: {
              tokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
              amount: BigInt(1000),
            },
            targetTransfer: {
              tokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
              amount: BigInt(1000),
            },
          },
          smartDigests: {
            userOpDigest:
              '0x5baad1e01c2149d054c7fd327eff823962c0efbd9d315bbadeeb45261ca6d5e1',
            executionDigest:
              '0x631feebedce2f51ff96ab6c059b1d13bb7aadb36ab8d1e8400d0c070c5227112',
            acrossTransferDigests: {
              digestIndex: BigInt(0),
              chainDataDigests: [
                '0x5cdc36dea4f46f1f892a3d8496dece0be3e81af55aa6984167f33835042df767',
              ],
            },
          },
          userSig:
            '0x2483DA3A338895199E5e538530213157e931Bf0672ede06cbfe5dc3cc6a04d5dbe68d43ae7eea66187c6e9b733be29362d7c972b5d9c4fed70c1114f0962b17358a6c2bb246c75e8d5120f8a2271f3b535aedcf01c',
        },
        auctionFee: BigInt(0),
        orchestratorSig:
          '0x82be0c8d789685dbd1cb4699614518b60ac53a6f8db864adcb90746fb15ea1160d2260f3861fda173fb94580e56deb559efe54c6d473571e46305dcf551962301b',
        acrossMessagePayload:
          '0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda02913000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000044a9059cbb0000000000000000000000007e287a503f0d19b7899c15e80eb18c0ee55ffd1200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000552483da3a338895199e5e538530213157e931bf0672ede06cbfe5dc3cc6a04d5dbe68d43ae7eea66187c6e9b733be29362d7c972b5d9c4fed70c1114f0962b17358a6c2bb246c75e8d5120f8a2271f3b535aedcf01c0000000000000000000000',
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
