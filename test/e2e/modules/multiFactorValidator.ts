import { Account, isModuleInstalled } from 'src/account'
import { getModule } from 'src/module'
import {
  getRemoveMFAValidatorAction,
  getSetMFAThresholdAction,
  getSetMFAValidatorAction,
  isMFASubValidator,
  MULTI_FACTOR_VALIDATOR_ADDRESS,
} from 'src/module/multi-factor-validator'
import { Address, Hex, PublicClient, slice, TestClient } from 'viem'
import { sendUserOp } from '../infra'

type Params = {
  account: Account
  publicClient: PublicClient
  testClient: TestClient
}

export const testMultiFactorValidator = async ({
  account,
  publicClient,
}: Params) => {
  it('should return true when checking multi factor validator isInstalled', async () => {
    const isMFAInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'validator',
        module: MULTI_FACTOR_VALIDATOR_ADDRESS,
      }),
    })

    expect(isMFAInstalled).toBe(true)
  }, 20000)

  it('should set validator threshold', async () => {
    const setThresholdAction = getSetMFAThresholdAction({ threshold: 1 })

    const receipt = await sendUserOp({ account, actions: [setThresholdAction] })

    expect(receipt).toBeDefined()
  }, 20000)

  it('should set new validator', async () => {
    const validatorAddress =
      '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3' as Address
    const validatorId = slice(validatorAddress, 0, 12) as Hex
    const newValidatorData = '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3' as Hex

    const setValidatorAction = getSetMFAValidatorAction({
      validatorAddress,
      validatorId,
      newValidatorData,
    })

    const receipt = await sendUserOp({ account, actions: [setValidatorAction] })

    expect(receipt).toBeDefined()
  }, 20000)

  it('should return true when checking if validator is sub validator', async () => {
    const validatorAddress =
      '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3' as Address
    const validatorId = slice(validatorAddress, 0, 12) as Hex

    const isSubValidatorResult = await isMFASubValidator({
      account,
      client: publicClient,
      subValidator: validatorAddress,
      validatorId,
    })

    expect(isSubValidatorResult).toBe(true)
  })

  it('should remove validator', async () => {
    const validatorAddress =
      '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3' as Address
    const validatorId = slice(validatorAddress, 0, 12) as Hex

    const removeValidatorAction = getRemoveMFAValidatorAction({
      validatorAddress,
      validatorId,
    })

    const receipt = await sendUserOp({
      account,
      actions: [removeValidatorAction],
    })

    expect(receipt).toBeDefined()
  }, 20000)
}
