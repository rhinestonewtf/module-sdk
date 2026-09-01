import { getSocialRecoveryValidator } from 'src/module/social-recovery/installation'
import { Address, decodeAbiParameters } from 'viem'
import {
  getAddSocialRecoveryGuardianAction,
  getSocialRecoveryGuardians,
  getRemoveSocialRecoveryGuardianAction,
  getSetSocialRecoveryThresholdAction,
} from 'src/module/social-recovery/usage'
import { getClient } from 'src/common/getClient'
import { MockClient } from '../../../../test/utils/mocks/client'
import { getAccount } from 'src/account'
import { MockAccountDeployed } from '../../../../test/utils/mocks/account'
import { GLOBAL_CONSTANTS } from 'src/constants'

describe('Social Recovery Module', () => {
  // Setup
  const client = getClient(MockClient)
  const account = getAccount(MockAccountDeployed)

  const guardians = [
    '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3',
    '0x9FF36a253C70b65122B47c70F2AfaF65F2957118',
  ] as Address[]

  it('should get install social recovery module', async () => {
    const installSocialRecoveryModule = getSocialRecoveryValidator({
      threshold: 3,
      guardians,
    })

    expect(installSocialRecoveryModule.module).toEqual(
      GLOBAL_CONSTANTS.SOCIAL_RECOVERY_ADDRESS,
    )
    expect(installSocialRecoveryModule.initData).toBeDefined()
    expect(installSocialRecoveryModule.type).toEqual('validator')
  })

  it('Should get setThresholdExecution action', async () => {
    const setThresholdExecution = getSetSocialRecoveryThresholdAction({
      threshold: 3,
    })

    expect(setThresholdExecution.target).toEqual(
      GLOBAL_CONSTANTS.SOCIAL_RECOVERY_ADDRESS,
    )
    expect(setThresholdExecution.value).toEqual(BigInt(0))
    expect(setThresholdExecution.callData).toBeDefined()
  })

  it('Should get addGuardianExecution action', async () => {
    const addGuardianExecution = getAddSocialRecoveryGuardianAction({
      guardian: guardians[0],
    })

    expect(addGuardianExecution.target).toEqual(
      GLOBAL_CONSTANTS.SOCIAL_RECOVERY_ADDRESS,
    )
    expect(addGuardianExecution.value).toEqual(BigInt(0))
    expect(addGuardianExecution.callData).toBeDefined()
  })

  it('Should throw error when guardian does not exists', async () => {
    async function getAction() {
      await getRemoveSocialRecoveryGuardianAction({
        account,
        client,
        guardian: guardians[1],
      })
    }

    await expect(getAction).rejects.toThrow('Guardian not found')
  })

  it('Should get list of guardians', async () => {
    const guardians = await getSocialRecoveryGuardians({
      account,
      client,
    })
    expect(guardians.length).toEqual(0)
  })

  it('should sort guardians numerically (case-insensitively), not by checksummed string order', async () => {
    // Real EIP-55 checksummed addresses where checksummed-string order
    // genuinely diverges from numeric (uint160) order: '0xF4E6...' sorts
    // before '0xf0B1...' as raw strings (uppercase F < lowercase f in
    // ASCII), but 0xf0B1... < 0xF4E6... numerically.
    const guardianA = '0xf0B1d0A8baaDEE0c06a78d630024b19AE0D9A25c' as Address
    const guardianB = '0xF4E6277366862046Dc965719AEe2F8AE5B55f0a4' as Address
    const checksummedGuardians = [guardianA, guardianB]

    const installSocialRecoveryModule = getSocialRecoveryValidator({
      threshold: 1,
      guardians: checksummedGuardians,
    })

    const [, sortedGuardians] = decodeAbiParameters(
      [{ type: 'uint256' }, { type: 'address[]' }],
      installSocialRecoveryModule.initData,
    ) as [bigint, Address[]]

    const asUint160 = sortedGuardians.map((g) => BigInt(g))
    expect(asUint160[0]! < asUint160[1]!).toBe(true)
    expect(sortedGuardians.map((g) => g.toLowerCase())).toEqual([
      guardianA.toLowerCase(),
      guardianB.toLowerCase(),
    ])

    // The input array (already in the correct numeric order) must not be
    // reordered in place by the sort - a plain `.sort()` on the checksummed
    // strings above WOULD swap these two elements.
    expect(checksummedGuardians).toEqual([guardianA, guardianB])
  })
})
