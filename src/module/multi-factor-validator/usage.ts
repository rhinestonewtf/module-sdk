import { Execution } from '../../account'
import {
  encodeFunctionData,
  Address,
  PublicClient,
  Hex,
  encodeAbiParameters,
  encodePacked,
} from 'viem'
import { abi } from './abi'
import { Account } from '../../account'
import { Validator } from './types'
import { GLOBAL_CONSTANTS } from '../../constants'

export const getSetMFAThresholdAction = ({
  threshold,
  address = GLOBAL_CONSTANTS.MULTI_FACTOR_VALIDATOR_ADDRESS,
}: {
  threshold: number
  // Defaults to the registry-bound MultiFactor. Pass
  // MULTI_FACTOR_VALIDATOR_V2_ADDRESS for the registry-free module.
  address?: Address
}): Execution => {
  const data = encodeFunctionData({
    functionName: 'setThreshold',
    abi,
    args: [threshold],
  })

  return {
    to: address,
    target: address,
    value: BigInt(0),
    callData: data,
    data,
  }
}

export const getSetMFAValidatorAction = ({
  validatorAddress,
  validatorId,
  newValidatorData,
  address = GLOBAL_CONSTANTS.MULTI_FACTOR_VALIDATOR_ADDRESS,
}: {
  validatorAddress: Address
  validatorId: Hex
  newValidatorData: Hex
  // Defaults to the registry-bound MultiFactor. Pass
  // MULTI_FACTOR_VALIDATOR_V2_ADDRESS for the registry-free module.
  address?: Address
}): Execution => {
  const data = encodeFunctionData({
    functionName: 'setValidator',
    abi,
    args: [validatorAddress, validatorId, newValidatorData],
  })

  return {
    to: address,
    target: address,
    value: BigInt(0),
    callData: data,
    data,
  }
}

export const getRemoveMFAValidatorAction = ({
  validatorAddress,
  validatorId,
  address = GLOBAL_CONSTANTS.MULTI_FACTOR_VALIDATOR_ADDRESS,
}: {
  validatorAddress: Address
  validatorId: Hex
  // Defaults to the registry-bound MultiFactor. Pass
  // MULTI_FACTOR_VALIDATOR_V2_ADDRESS for the registry-free module.
  address?: Address
}): Execution => {
  const data = encodeFunctionData({
    functionName: 'removeValidator',
    abi,
    args: [validatorAddress, validatorId],
  })

  return {
    to: address,
    target: address,
    value: BigInt(0),
    callData: data,
    data,
  }
}

export const isMFASubValidator = async ({
  account,
  client,
  subValidator,
  validatorId,
  address = GLOBAL_CONSTANTS.MULTI_FACTOR_VALIDATOR_ADDRESS,
}: {
  account: Account
  client: PublicClient
  subValidator: Address
  validatorId: Hex
  // Defaults to the registry-bound MultiFactor. Pass
  // MULTI_FACTOR_VALIDATOR_V2_ADDRESS for the registry-free module.
  address?: Address
}): Promise<boolean> => {
  try {
    return (await client.readContract({
      address,
      abi,
      functionName: 'isSubValidator',
      args: [account.address, subValidator, validatorId],
    })) as boolean
  } catch (err) {
    throw new Error(`Failed to check if ${subValidator} is a sub-validator`)
  }
}

export const getMFAValidatorMockSignature = () => {
  const mockValidators: Validator[] = [
    {
      packedValidatorAndId: encodePacked(
        ['bytes12', 'address'],
        [
          '0x000000000000000000000000',
          '0xf83d07238a7c8814a48535035602123ad6dbfa63',
        ],
      ),
      // signature
      data: '0xe8b94748580ca0b4993c9a1b86b5be851bfc076ff5ce3a1ff65bf16392acfcb800f9b4f1aef1555c7fce5599fffb17e7c635502154a0333ba21f3ae491839af51c' as Hex,
    },
  ]

  return encodeAbiParameters(
    [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'packedValidatorAndId',
            type: 'bytes32',
          },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
        ],
        name: 'validators',
        type: 'tuple[]',
      },
    ],
    [mockValidators],
  )
}
