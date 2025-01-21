import { Account, isModuleInstalled } from 'src/account'
import {
  getAddGuardianAction,
  getAllGuardians,
  getAllowedSelectors,
  getAllowedValidators,
  getAllowValidatorRecoveryAction,
  getChangeThresholdAction,
  getDisallowValidatorRecoveryAction,
  getGuardian,
  getGuardianConfig,
  getModule,
  getRecoveryConfig,
  getRemoveGuardianAction,
  getUpdateRecoveryConfigAction,
} from 'src/module'
import {
  getAddress,
  PublicClient,
  TestClient,
  toFunctionSelector,
  toHex,
} from 'viem'
import { sendUserOp } from '../infra'
import { SENTINEL_ADDRESS } from 'src/common'
import { GLOBAL_CONSTANTS } from 'src/constants'

type Params = {
  account: Account
  publicClient: PublicClient
  testClient: TestClient
}

export const testUniversalEmailRecoveryExecutor = async ({
  account,
  publicClient,
}: Params) => {
  it('should return true when checking universal email recovery executor isInstalled', async () => {
    const isUniversalEmailRecoveryInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'executor',
        module: GLOBAL_CONSTANTS.UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
      }),
    })

    expect(isUniversalEmailRecoveryInstalled).toBe(true)
  }, 20000)

  it('should add guardian', async () => {
    const newGuardian = getAddress('0x206f270A1eBB6Dd3Bc97581376168014FD6eE57c')
    const weight = 1n

    const execution = await getAddGuardianAction({
      client: publicClient,
      guardian: newGuardian,
      weight,
    })

    await sendUserOp({
      account,
      actions: [execution],
    })

    const guardians = await getAllGuardians({
      account,
      client: publicClient,
    })
    const guardian = await getGuardian({
      account,
      client: publicClient,
      guardian: newGuardian,
    })

    expect(guardians.length).toBe(3)
    expect(guardians.includes(newGuardian)).toBe(true)
    expect(guardian.weight).toBe(weight)
    expect(guardian.status).toBe(1)
  }, 20000)

  it('should remove guardian', async () => {
    const guardianToRemove = getAddress(
      '0x206f270A1eBB6Dd3Bc97581376168014FD6eE57c',
    )

    const execution = await getRemoveGuardianAction({
      client: publicClient,
      guardian: guardianToRemove,
    })

    await sendUserOp({
      account,
      actions: [execution],
    })

    const guardians = await getAllGuardians({
      account,
      client: publicClient,
    })
    const guardian = await getGuardian({
      account,
      client: publicClient,
      guardian: guardianToRemove,
    })

    expect(guardians.length).toBe(2)
    expect(guardians.includes(guardianToRemove)).toBe(false)
    expect(guardian.weight).toBe(0n)
    expect(guardian.status).toBe(0)
  }, 20000)

  it('should change threshold', async () => {
    const newThreshold = 1n

    const execution = await getChangeThresholdAction({
      client: publicClient,
      threshold: newThreshold,
    })

    await sendUserOp({
      account,
      actions: [execution],
    })

    const config = await getGuardianConfig({
      account,
      client: publicClient,
    })

    expect(config.threshold).toBe(newThreshold)
  }, 20000)

  it('should update recovery config', async () => {
    const delay = 86400n // 1 day
    const expiry = 604800n // 1 week

    const execution = await getUpdateRecoveryConfigAction({
      client: publicClient,
      delay,
      expiry,
    })

    await sendUserOp({
      account,
      actions: [execution],
    })

    const config = await getRecoveryConfig({
      account,
      client: publicClient,
    })

    expect(config.delay).toBe(delay)
    expect(config.expiry).toBe(expiry)
  }, 20000)

  it('should allow validator recovery', async () => {
    const validator = GLOBAL_CONSTANTS.MULTI_FACTOR_VALIDATOR_ADDRESS
    const isInstalledContext = toHex(0)
    const recoverySelector = toFunctionSelector(
      'function setValidator(address,ValidatorId,bytes)',
    )

    const execution = await getAllowValidatorRecoveryAction({
      client: publicClient,
      validator,
      isInstalledContext,
      recoverySelector,
    })

    await sendUserOp({
      account,
      actions: [execution],
    })

    const validators = await getAllowedValidators({
      account,
      client: publicClient,
    })
    const selectors = await getAllowedSelectors({
      account,
      client: publicClient,
    })

    expect(validators.length).toBe(2)
    expect(selectors.length).toBe(2)
    expect(validators[0]).toBe(validator)
    expect(selectors[0]).toBe(recoverySelector)
  }, 20000)

  it('should disallow validator recovery', async () => {
    const validator = GLOBAL_CONSTANTS.MULTI_FACTOR_VALIDATOR_ADDRESS
    const prevValidator = SENTINEL_ADDRESS
    const recoverySelector = toFunctionSelector(
      'function setValidator(address,ValidatorId,bytes)',
    )

    const execution = await getDisallowValidatorRecoveryAction({
      client: publicClient,
      validator,
      prevValidator,
      recoverySelector,
    })

    await sendUserOp({
      account,
      actions: [execution],
    })

    const validators = await getAllowedValidators({
      account,
      client: publicClient,
    })
    const selectors = await getAllowedSelectors({
      account,
      client: publicClient,
    })

    expect(validators.length).toBe(1)
    expect(selectors.length).toBe(1)
    expect(validators[0]).toBe(GLOBAL_CONSTANTS.OWNABLE_VALIDATOR_ADDRESS)
    expect(selectors[0]).toBe(
      toFunctionSelector('function addOwner(address owner)'),
    )
  }, 20000)
}
