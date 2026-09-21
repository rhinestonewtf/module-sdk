import { getClient } from 'src'
import { MockClient } from '../../../utils/mocks/client'
import { getAccount } from 'src'
import { MockAccountDeployed } from '../../../utils/mocks/account'
import {
  getMultiFactorValidator,
  getRemoveMFAValidatorAction,
  getSetMFAValidatorAction,
  isMFASubValidator,
} from 'src/module'
import { getSetMFAThresholdAction } from 'src'
import { Validator } from 'src/module'
import { Address, encodePacked, Hex, slice } from 'viem'
import { GLOBAL_CONSTANTS } from 'src'

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
        packedValidatorAndId: encodePacked(
          ['bytes12', 'address'],
          [
            '0x000000000000000000000000',
            '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3',
          ],
        ),
        data: '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3',
      },
      {
        packedValidatorAndId: encodePacked(
          ['bytes12', 'address'],
          [
            '0x000000000000000000000000',
            '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3',
          ],
        ),
        data: '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3',
      },
    ] as Validator[],
  }

  it('should get install multi factor module', async () => {
    const installHookMultiPlexerModule = getMultiFactorValidator(mfaData)

    expect(installHookMultiPlexerModule.module).toEqual(
      GLOBAL_CONSTANTS.MULTI_FACTOR_VALIDATOR_ADDRESS,
    )
    expect(installHookMultiPlexerModule.initData).toBeDefined()
    expect(installHookMultiPlexerModule.type).toEqual('validator')
  })

  it('should get setThreshold execution', async () => {
    const setThresholdExecution = getSetMFAThresholdAction({
      threshold: 2,
    })

    expect(setThresholdExecution.target).toEqual(
      GLOBAL_CONSTANTS.MULTI_FACTOR_VALIDATOR_ADDRESS,
    )
    expect(setThresholdExecution.value).toEqual(BigInt(0))
    expect(setThresholdExecution.callData).toBeDefined()
  })

  it('should get setThreshold execution targeting the V2 (registry-free) MultiFactor when an explicit address is passed', async () => {
    const setThresholdExecution = getSetMFAThresholdAction({
      threshold: 2,
      address: GLOBAL_CONSTANTS.MULTI_FACTOR_VALIDATOR_V2_ADDRESS,
    })

    expect(setThresholdExecution.target).toEqual(
      GLOBAL_CONSTANTS.MULTI_FACTOR_VALIDATOR_V2_ADDRESS,
    )
    expect(setThresholdExecution.to).toEqual(
      GLOBAL_CONSTANTS.MULTI_FACTOR_VALIDATOR_V2_ADDRESS,
    )
    expect(setThresholdExecution.target).not.toEqual(
      GLOBAL_CONSTANTS.MULTI_FACTOR_VALIDATOR_ADDRESS,
    )
  })

  it('should get setValidator execution', async () => {
    const setValidatorExecution = getSetMFAValidatorAction({
      validatorAddress,
      validatorId,
      newValidatorData,
    })

    expect(setValidatorExecution.target).toEqual(
      GLOBAL_CONSTANTS.MULTI_FACTOR_VALIDATOR_ADDRESS,
    )
    expect(setValidatorExecution.value).toEqual(BigInt(0))
    expect(setValidatorExecution.callData).toBeDefined()
  })

  it('should get setValidator execution targeting the V2 (registry-free) MultiFactor when an explicit address is passed', async () => {
    const setValidatorExecution = getSetMFAValidatorAction({
      validatorAddress,
      validatorId,
      newValidatorData,
      address: GLOBAL_CONSTANTS.MULTI_FACTOR_VALIDATOR_V2_ADDRESS,
    })

    expect(setValidatorExecution.target).toEqual(
      GLOBAL_CONSTANTS.MULTI_FACTOR_VALIDATOR_V2_ADDRESS,
    )
    expect(setValidatorExecution.to).toEqual(
      GLOBAL_CONSTANTS.MULTI_FACTOR_VALIDATOR_V2_ADDRESS,
    )
    expect(setValidatorExecution.target).not.toEqual(
      GLOBAL_CONSTANTS.MULTI_FACTOR_VALIDATOR_ADDRESS,
    )
  })

  it('should get removeValidator execution', async () => {
    const removeValidatorExecution = getRemoveMFAValidatorAction({
      validatorAddress,
      validatorId,
    })

    expect(removeValidatorExecution.target).toEqual(
      GLOBAL_CONSTANTS.MULTI_FACTOR_VALIDATOR_ADDRESS,
    )
    expect(removeValidatorExecution.value).toEqual(BigInt(0))
    expect(removeValidatorExecution.callData).toBeDefined()
  })

  it('should get removeValidator execution targeting the V2 (registry-free) MultiFactor when an explicit address is passed', async () => {
    const removeValidatorExecution = getRemoveMFAValidatorAction({
      validatorAddress,
      validatorId,
      address: GLOBAL_CONSTANTS.MULTI_FACTOR_VALIDATOR_V2_ADDRESS,
    })

    expect(removeValidatorExecution.target).toEqual(
      GLOBAL_CONSTANTS.MULTI_FACTOR_VALIDATOR_V2_ADDRESS,
    )
    expect(removeValidatorExecution.to).toEqual(
      GLOBAL_CONSTANTS.MULTI_FACTOR_VALIDATOR_V2_ADDRESS,
    )
    expect(removeValidatorExecution.target).not.toEqual(
      GLOBAL_CONSTANTS.MULTI_FACTOR_VALIDATOR_ADDRESS,
    )
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

  it('should route isMFASubValidator reads to the V2 (registry-free) MultiFactor when an explicit address is passed', async () => {
    const readContractSpy = jest
      .spyOn(client, 'readContract')
      .mockResolvedValue(true)

    const isValidator = await isMFASubValidator({
      account,
      client,
      validatorId,
      subValidator: validatorAddress,
      address: GLOBAL_CONSTANTS.MULTI_FACTOR_VALIDATOR_V2_ADDRESS,
    })

    expect(isValidator).toEqual(true)
    expect(readContractSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        address: GLOBAL_CONSTANTS.MULTI_FACTOR_VALIDATOR_V2_ADDRESS,
      }),
    )

    readContractSpy.mockRestore()
  })
})
