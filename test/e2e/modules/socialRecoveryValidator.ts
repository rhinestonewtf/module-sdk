import { Account, Execution, isModuleInstalled } from 'src/account'
import { getModule } from 'src/module'
import { Address, PublicClient, TestClient } from 'viem'
import {
  getAddSocialRecoveryGuardianAction,
  getSocialRecoveryGuardians,
  getRemoveSocialRecoveryGuardianAction,
  getSetSocialRecoveryThresholdAction,
} from 'src/module/social-recovery/usage'
import { sendUserOp } from '../infra'
import { GLOBAL_CONSTANTS } from 'src/constants'

type Params = {
  account: Account
  publicClient: PublicClient
  testClient: TestClient
}

export const testSocialRecoveryValidator = async ({
  account,
  publicClient,
}: Params) => {
  it('should return true when checking social recovery validator isInstalled', async () => {
    const isSocialRecoveryInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'validator',
        module: GLOBAL_CONSTANTS.SOCIAL_RECOVERY_ADDRESS,
      }),
    })

    expect(isSocialRecoveryInstalled).toBe(true)
  }, 20000)

  it('should set the threshold to 1', async () => {
    const execution = getSetSocialRecoveryThresholdAction({ threshold: 1 })

    const receipt = await sendUserOp({
      account,
      actions: [execution],
    })

    expect(receipt).toBeDefined()
  }, 20000)

  it('should add new guardian', async () => {
    const newGuardian = '0x206f270A1eBB6Dd3Bc97581376168014FD6eE57c' as Address

    const execution = getAddSocialRecoveryGuardianAction({
      guardian: newGuardian,
    })

    await sendUserOp({
      account,
      actions: [execution],
    })
    const newGuardians = await getSocialRecoveryGuardians({
      account,
      client: publicClient,
    })

    expect(newGuardians.includes(newGuardian)).toBe(true)
  }, 20000)

  it('should remove guardian', async () => {
    const guardianToRemove =
      '0x206f270A1eBB6Dd3Bc97581376168014FD6eE57c' as Address

    const allGuardians = await getSocialRecoveryGuardians({
      account,
      client: publicClient,
    })

    expect(allGuardians.includes(guardianToRemove)).toBe(true)

    const execution = await getRemoveSocialRecoveryGuardianAction({
      account,
      client: publicClient,
      guardian: guardianToRemove,
    })

    await sendUserOp({
      account,
      actions: [execution as Execution],
    })

    const newGuardians = await getSocialRecoveryGuardians({
      account,
      client: publicClient,
    })

    expect(newGuardians.includes(guardianToRemove)).toBe(false)
  }, 20000)
}
