import { getSocialRecoveryValidator } from 'src/module/social-recovery/installation'
import { SOCIAL_RECOVERY_ADDRESS } from 'src/module/social-recovery/constants'
import { Address } from 'viem'
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

    expect(installSocialRecoveryModule.module).toEqual(SOCIAL_RECOVERY_ADDRESS)
    expect(installSocialRecoveryModule.initData).toBeDefined()
    expect(installSocialRecoveryModule.type).toEqual('validator')
  })

  it('Should get setThresholdExecution action', async () => {
    const setThresholdExecution = getSetSocialRecoveryThresholdAction({
      threshold: 3,
    })

    expect(setThresholdExecution.target).toEqual(SOCIAL_RECOVERY_ADDRESS)
    expect(setThresholdExecution.value).toEqual(BigInt(0))
    expect(setThresholdExecution.callData).toBeDefined()
  })

  it('Should get addGuardianExecution action', async () => {
    const addGuardianExecution = getAddSocialRecoveryGuardianAction({
      guardian: guardians[0],
    })

    expect(addGuardianExecution.target).toEqual(SOCIAL_RECOVERY_ADDRESS)
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
})
