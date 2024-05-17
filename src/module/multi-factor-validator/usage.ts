import { Execution } from '../../account'
import { encodeFunctionData, Address, PublicClient, Hex } from 'viem'
import { abi } from './abi'
import { Account } from '../../account'
import { MULTI_FACTOR_VALIDATOR_ADDRESS } from './constants'

export const getSetThresholdExecution = ({
  threshold,
}: {
  threshold: number
}): Execution => {
  return {
    target: MULTI_FACTOR_VALIDATOR_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'setThreshold',
      abi,
      args: [threshold],
    }),
  }
}

export const getSetValidatorExecution = ({
  validatorAddress,
  validatorId,
  newValidatorData,
}: {
  validatorAddress: Address
  validatorId: Hex
  newValidatorData: Hex
}): Execution => {
  return {
    target: MULTI_FACTOR_VALIDATOR_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'setValidator',
      abi,
      args: [validatorAddress, validatorId, newValidatorData],
    }),
  }
}

export const getRemoveValidatorExecution = ({
  validatorAddress,
  validatorId,
}: {
  validatorAddress: Address
  validatorId: Hex
}): Execution => {
  return {
    target: MULTI_FACTOR_VALIDATOR_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'removeValidator',
      abi,
      args: [validatorAddress, validatorId],
    }),
  }
}

export const isSubValidator = async ({
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
