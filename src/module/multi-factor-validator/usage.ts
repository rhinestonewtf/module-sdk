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
import { MULTI_FACTOR_VALIDATOR_ADDRESS } from './constants'
import { Validator } from './types'

export const getSetMFAThresholdAction = ({
  threshold,
}: {
  threshold: number
}): Execution => {
  const data = encodeFunctionData({
    functionName: 'setThreshold',
    abi,
    args: [threshold],
  })

  return {
    to: MULTI_FACTOR_VALIDATOR_ADDRESS,
    target: MULTI_FACTOR_VALIDATOR_ADDRESS,
    value: BigInt(0),
    callData: data,
    data,
  }
}

export const getSetMFAValidatorAction = ({
  validatorAddress,
  validatorId,
  newValidatorData,
}: {
  validatorAddress: Address
  validatorId: Hex
  newValidatorData: Hex
}): Execution => {
  const data = encodeFunctionData({
    functionName: 'setValidator',
    abi,
    args: [validatorAddress, validatorId, newValidatorData],
  })

  return {
    to: MULTI_FACTOR_VALIDATOR_ADDRESS,
    target: MULTI_FACTOR_VALIDATOR_ADDRESS,
    value: BigInt(0),
    callData: data,
    data,
  }
}

export const getRemoveMFAValidatorAction = ({
  validatorAddress,
  validatorId,
}: {
  validatorAddress: Address
  validatorId: Hex
}): Execution => {
  const data = encodeFunctionData({
    functionName: 'removeValidator',
    abi,
    args: [validatorAddress, validatorId],
  })

  return {
    to: MULTI_FACTOR_VALIDATOR_ADDRESS,
    target: MULTI_FACTOR_VALIDATOR_ADDRESS,
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
}: {
  account: Account
  client: PublicClient
  subValidator: Address
  validatorId: Hex
}): Promise<boolean> => {
  try {
    return (await client.readContract({
      address: MULTI_FACTOR_VALIDATOR_ADDRESS,
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
