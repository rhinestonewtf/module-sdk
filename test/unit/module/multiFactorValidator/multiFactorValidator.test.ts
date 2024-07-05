import { getClient } from 'src'
import { MockClient } from '../../../utils/mocks/client'
import { getAccount } from 'src'
import { MockAccountDeployed } from '../../../utils/mocks/account'
import {
  MULTI_FACTOR_VALIDATOR_ADDRESS,
  getMultiFactorValidator,
  getRemoveMFAValidatorAction,
  getSetMFAValidatorAction,
  isMFASubValidator,
} from 'src/module'
import { getSetMFAThresholdAction } from 'src'
import { Validator } from 'src/module'
import { Address, Hex, slice } from 'viem'

describe('MultiFactor Validator Module', () => {
  // Setup
  const account = getAccount(MockAccountDeployed)
  const client = getClient(MockClient)
  const validatorAddress =
    '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3' as Address
  const validatorId = slice(validatorAddress, 0, 12) as Hex
  const newValidatorData = '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3' as Hex

  const mfaData = {
    threshold: 2,
    validators: [
      {
        packedValidatorAndId: '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3',
        data: '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3',
      },
      {
        packedValidatorAndId: '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3',
        data: '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3',
      },
    ] as Validator[],
  }

  it('should get install multi factor module', async () => {
    const installHookMultiPlexerModule = getMultiFactorValidator(mfaData)

    expect(installHookMultiPlexerModule.module).toEqual(
      MULTI_FACTOR_VALIDATOR_ADDRESS,
    )
    expect(installHookMultiPlexerModule.initData).toBeDefined()
    expect(installHookMultiPlexerModule.type).toEqual('validator')
  })

  it('should get setThreshold execution', async () => {
    const setThresholdExecution = getSetMFAThresholdAction({
      threshold: 2,
    })

    expect(setThresholdExecution.target).toEqual(MULTI_FACTOR_VALIDATOR_ADDRESS)
    expect(setThresholdExecution.value).toEqual(BigInt(0))
    expect(setThresholdExecution.callData).toBeDefined()
  })

  it('should get setValidator execution', async () => {
    const setValidatorExecution = getSetMFAValidatorAction({
      validatorAddress,
      validatorId,
      newValidatorData,
    })

    expect(setValidatorExecution.target).toEqual(MULTI_FACTOR_VALIDATOR_ADDRESS)
    expect(setValidatorExecution.value).toEqual(BigInt(0))
    expect(setValidatorExecution.callData).toBeDefined()
  })

  it('should get removeValidator execution', async () => {
    const removeValidatorExecution = getRemoveMFAValidatorAction({
      validatorAddress,
      validatorId,
    })

    expect(removeValidatorExecution.target).toEqual(
      MULTI_FACTOR_VALIDATOR_ADDRESS,
    )
    expect(removeValidatorExecution.value).toEqual(BigInt(0))
    expect(removeValidatorExecution.callData).toBeDefined()
  })

  it('should isSubValidator return false if subValidator is not installed', async () => {
    const isValidator = await isMFASubValidator({
      account,
      client,
      validatorId,
      subValidator: validatorAddress,
    })

    expect(isValidator).toEqual(false)
  })
})
