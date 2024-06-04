import { getInstallSocialRecovery } from 'src/module/social-recovery/installation'
import { SOCIAL_RECOVERY_ADDRESS } from 'src/module/social-recovery/constants'
import { Address } from 'viem'
import {
  getAddGuardianAction,
  getGuardians,
  getRemoveGuardianAction,
  getSetThresholdAction,
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
    const installSocialRecoveryModule = getInstallSocialRecovery({
      threshold: 3,
      guardians,
    })

    expect(installSocialRecoveryModule.module).toEqual(SOCIAL_RECOVERY_ADDRESS)
    expect(installSocialRecoveryModule.data).toBeDefined()
    expect(installSocialRecoveryModule.type).toEqual('validator')
  })

  it('Should get setThresholdExecution action', async () => {
    const setThresholdExecution = getSetThresholdAction({
      threshold: 3,
    })

    expect(setThresholdExecution.target).toEqual(SOCIAL_RECOVERY_ADDRESS)
    expect(setThresholdExecution.value).toEqual(BigInt(0))
    expect(setThresholdExecution.callData).toBeDefined()
  })

  it('Should get addGuardianExecution action', async () => {
    const addGuardianExecution = getAddGuardianAction({
      guardian: guardians[0],
    })

    expect(addGuardianExecution.target).toEqual(SOCIAL_RECOVERY_ADDRESS)
    expect(addGuardianExecution.value).toEqual(BigInt(0))
    expect(addGuardianExecution.callData).toBeDefined()
  })

  it('Should throw error when guardian not exists', async () => {
    const removeGuardianExecution = await getRemoveGuardianAction({
      account,
      client,
      guardian: guardians[1],
    })

    expect((removeGuardianExecution as Error).message).toEqual(
      'Guardian not found',
    )
  })

  it('Should get list of guardians', async () => {
    const guardians = await getGuardians({
      account,
      client,
    })
    expect(guardians.length).toEqual(0)
  })
})
