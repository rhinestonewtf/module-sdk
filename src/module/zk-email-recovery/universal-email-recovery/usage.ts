import { getModuleAddress } from './constants'
import { Execution } from '../../../account/types'
import {
  Address,
  encodeFunctionData,
  Hex,
  PublicClient,
  toHex,
  zeroAddress,
} from 'viem'
import { Account } from '../../../account/types'
import { abi } from './abi'

export type EmailAuthMsg = {
  templateId: bigint
  commandParams: Hex[]
  skippedCommandPrefix: bigint
  proof: EmailProof
}

export type EmailProof = {
  domainName: string
  publicKeyHash: Hex
  timestamp: bigint
  maskedCommand: string
  emailNullifier: Hex
  accountSalt: Hex
  isCodeExist: boolean
  proof: Hex
}

export const getRecoveryConfig = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<{ delay: bigint; expiry: bigint }> => {
  const address = getModuleAddress(await client.getChainId())
  try {
    return await client.readContract({
      address,
      abi,
      functionName: 'getRecoveryConfig',
      args: [account.address],
    })
  } catch (err) {
    return { delay: 0n, expiry: 0n }
  }
}

export const getRecoveryRequest = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<readonly [bigint, bigint, bigint, Hex]> => {
  const address = getModuleAddress(await client.getChainId())
  try {
    return await client.readContract({
      address,
      abi,
      functionName: 'getRecoveryRequest',
      args: [account.address],
    })
  } catch (err) {
    return [0n, 0n, 0n, toHex(0, { size: 32 })]
  }
}

export const getPreviousRecoveryRequest = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<{
  previousGuardianInitiated: Address
  cancelRecoveryCooldown: bigint
}> => {
  const address = getModuleAddress(await client.getChainId())
  try {
    return await client.readContract({
      address,
      abi,
      functionName: 'getPreviousRecoveryRequest',
      args: [account.address],
    })
  } catch (err) {
    return {
      previousGuardianInitiated: zeroAddress,
      cancelRecoveryCooldown: 0n,
    }
  }
}

export const isActivated = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<boolean> => {
  const address = getModuleAddress(await client.getChainId())
  try {
    return await client.readContract({
      address,
      abi,
      functionName: 'isActivated',
      args: [account.address],
    })
  } catch (err) {
    return false
  }
}

export const canStartRecoveryRequest = async ({
  account,
  client,
  validator,
}: {
  account: Account
  client: PublicClient
  validator: Address
}): Promise<boolean> => {
  const address = getModuleAddress(await client.getChainId())
  try {
    return await client.readContract({
      address,
      abi,
      functionName: 'canStartRecoveryRequest',
      args: [account.address, validator],
    })
  } catch (err) {
    return false
  }
}

export const getAllowValidatorRecoveryAction = async ({
  client,
  validator,
  isInstalledContext,
  recoverySelector,
}: {
  client: PublicClient
  validator: Address
  isInstalledContext: Hex
  recoverySelector: Hex
}): Promise<Execution> => {
  const address = getModuleAddress(await client.getChainId())
  const data = encodeFunctionData({
    functionName: 'allowValidatorRecovery',
    abi,
    args: [validator, isInstalledContext, recoverySelector],
  })

  return {
    to: address,
    target: address,
    value: 0n,
    callData: data,
    data,
  }
}

export const getDisallowValidatorRecoveryAction = async ({
  client,
  validator,
  prevValidator,
  recoverySelector,
}: {
  client: PublicClient
  validator: Address
  prevValidator: Address
  recoverySelector: Hex
}): Promise<Execution> => {
  const address = getModuleAddress(await client.getChainId())
  const data = encodeFunctionData({
    functionName: 'disallowValidatorRecovery',
    abi,
    args: [validator, prevValidator, recoverySelector],
  })

  return {
    to: address,
    target: address,
    value: 0n,
    callData: data,
    data,
  }
}

export const getAllowedValidators = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<readonly Address[]> => {
  const address = getModuleAddress(await client.getChainId())
  try {
    return await client.readContract({
      address,
      abi,
      functionName: 'getAllowedValidators',
      args: [account.address],
    })
  } catch (err) {
    return []
  }
}

export const getAllowedSelectors = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<readonly Hex[]> => {
  const address = getModuleAddress(await client.getChainId())
  try {
    return await client.readContract({
      address,
      abi,
      functionName: 'getAllowedSelectors',
      args: [account.address],
    })
  } catch (err) {
    return []
  }
}

export const acceptanceCommandTemplates = async ({
  client,
}: {
  client: PublicClient
}): Promise<readonly (readonly string[])[]> => {
  const address = getModuleAddress(await client.getChainId())
  try {
    return await client.readContract({
      address,
      abi,
      functionName: 'acceptanceCommandTemplates',
    })
  } catch (err) {
    return []
  }
}

export const recoveryCommandTemplates = async ({
  client,
}: {
  client: PublicClient
}): Promise<readonly (readonly string[])[]> => {
  const address = getModuleAddress(await client.getChainId())
  try {
    return await client.readContract({
      address,
      abi,
      functionName: 'recoveryCommandTemplates',
    })
  } catch (err) {
    return []
  }
}

export const extractRecoveredAccountFromAcceptanceCommand = async ({
  client,
  commandParams,
  templateIdx,
}: {
  client: PublicClient
  commandParams: Hex[]
  templateIdx: bigint
}): Promise<Address> => {
  const address = getModuleAddress(await client.getChainId())
  try {
    return await client.readContract({
      address,
      abi,
      functionName: 'extractRecoveredAccountFromAcceptanceCommand',
      args: [commandParams, templateIdx],
    })
  } catch (err) {
    return zeroAddress
  }
}

export const extractRecoveredAccountFromRecoveryCommand = async ({
  client,
  commandParams,
  templateIdx,
}: {
  client: PublicClient
  commandParams: Hex[]
  templateIdx: bigint
}): Promise<Address> => {
  const address = getModuleAddress(await client.getChainId())
  try {
    return await client.readContract({
      address,
      abi,
      functionName: 'extractRecoveredAccountFromRecoveryCommand',
      args: [commandParams, templateIdx],
    })
  } catch (err) {
    return zeroAddress
  }
}

export const computeAcceptanceTemplateId = async ({
  client,
  templateIdx,
}: {
  client: PublicClient
  templateIdx: bigint
}): Promise<bigint> => {
  const address = getModuleAddress(await client.getChainId())
  try {
    return await client.readContract({
      address,
      abi,
      functionName: 'computeAcceptanceTemplateId',
      args: [templateIdx],
    })
  } catch (err) {
    return 0n
  }
}

export const computeRecoveryTemplateId = async ({
  client,
  templateIdx,
}: {
  client: PublicClient
  templateIdx: bigint
}): Promise<bigint> => {
  const address = getModuleAddress(await client.getChainId())
  try {
    return await client.readContract({
      address,
      abi,
      functionName: 'computeRecoveryTemplateId',
      args: [templateIdx],
    })
  } catch (err) {
    return 0n
  }
}

export const getVerifier = async ({
  client,
}: {
  client: PublicClient
}): Promise<Address> => {
  const address = getModuleAddress(await client.getChainId())
  try {
    return await client.readContract({
      address,
      abi,
      functionName: 'verifier',
    })
  } catch (err) {
    return zeroAddress
  }
}

export const getDkim = async ({
  client,
}: {
  client: PublicClient
}): Promise<Address> => {
  const address = getModuleAddress(await client.getChainId())
  try {
    return await client.readContract({
      address,
      abi,
      functionName: 'dkim',
    })
  } catch (err) {
    return zeroAddress
  }
}

export const getEmailAuthImplementation = async ({
  client,
}: {
  client: PublicClient
}): Promise<Address> => {
  const address = getModuleAddress(await client.getChainId())
  try {
    return await client.readContract({
      address,
      abi,
      functionName: 'emailAuthImplementation',
    })
  } catch (err) {
    return zeroAddress
  }
}

export const getUpdateRecoveryConfigAction = async ({
  client,
  delay,
  expiry,
}: {
  client: PublicClient
  delay: bigint
  expiry: bigint
}): Promise<Execution> => {
  const address = getModuleAddress(await client.getChainId())
  const data = encodeFunctionData({
    functionName: 'updateRecoveryConfig',
    abi,
    args: [{ delay, expiry }],
  })

  return {
    to: address,
    target: address,
    value: 0n,
    callData: data,
    data,
  }
}

export const getHandleAcceptanceAction = async ({
  client,
  emailAuthMsg,
  templateIdx,
}: {
  client: PublicClient
  emailAuthMsg: EmailAuthMsg
  templateIdx: bigint
}): Promise<Execution> => {
  const address = getModuleAddress(await client.getChainId())
  const data = encodeFunctionData({
    functionName: 'handleAcceptance',
    abi,
    args: [emailAuthMsg, templateIdx],
  })

  return {
    to: address,
    target: address,
    value: 0n,
    callData: data,
    data,
  }
}

export const getHandleRecoveryAction = async ({
  client,
  emailAuthMsg,
  templateIdx,
}: {
  client: PublicClient
  emailAuthMsg: EmailAuthMsg
  templateIdx: bigint
}): Promise<Execution> => {
  const address = getModuleAddress(await client.getChainId())
  const data = encodeFunctionData({
    functionName: 'handleRecovery',
    abi,
    args: [emailAuthMsg, templateIdx],
  })

  return {
    to: address,
    target: address,
    value: 0n,
    callData: data,
    data,
  }
}

export const getCompleteRecoveryAction = async ({
  client,
  account,
  recoveryData,
}: {
  client: PublicClient
  account: Address
  recoveryData: Hex
}): Promise<Execution> => {
  const address = getModuleAddress(await client.getChainId())
  const data = encodeFunctionData({
    functionName: 'completeRecovery',
    abi,
    args: [account, recoveryData],
  })

  return {
    to: address,
    target: address,
    value: 0n,
    callData: data,
    data,
  }
}

export const getCancelRecoveryAction = async ({
  client,
}: {
  client: PublicClient
}): Promise<Execution> => {
  const address = getModuleAddress(await client.getChainId())
  const data = encodeFunctionData({
    functionName: 'cancelRecovery',
    abi,
  })

  return {
    to: address,
    target: address,
    value: 0n,
    callData: data,
    data,
  }
}

export const getCancelExpiredRecoveryAction = async ({
  client,
  account,
}: {
  client: PublicClient
  account: Address
}): Promise<Execution> => {
  const address = getModuleAddress(await client.getChainId())
  const data = encodeFunctionData({
    functionName: 'cancelExpiredRecovery',
    abi,
    args: [account],
  })

  return {
    to: address,
    target: address,
    value: 0n,
    callData: data,
    data,
  }
}

export const computeEmailAuthAddress = async ({
  client,
  recoveredAccount,
  accountSalt,
}: {
  client: PublicClient
  recoveredAccount: Address
  accountSalt: Hex
}): Promise<Address> => {
  const address = getModuleAddress(await client.getChainId())
  try {
    return await client.readContract({
      address,
      abi,
      functionName: 'computeEmailAuthAddress',
      args: [recoveredAccount, accountSalt],
    })
  } catch (err) {
    return zeroAddress
  }
}

export const getGuardianConfig = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<{
  guardianCount: bigint
  totalWeight: bigint
  acceptedWeight: bigint
  threshold: bigint
}> => {
  const address = getModuleAddress(await client.getChainId())
  try {
    return await client.readContract({
      address,
      abi,
      functionName: 'getGuardianConfig',
      args: [account.address],
    })
  } catch (err) {
    return {
      guardianCount: 0n,
      totalWeight: 0n,
      acceptedWeight: 0n,
      threshold: 0n,
    }
  }
}

export const getGuardian = async ({
  account,
  client,
  guardian,
}: {
  account: Account
  client: PublicClient
  guardian: Address
}): Promise<{ status: number; weight: bigint }> => {
  const address = getModuleAddress(await client.getChainId())
  try {
    return await client.readContract({
      address,
      abi,
      functionName: 'getGuardian',
      args: [account.address, guardian],
    })
  } catch (err) {
    return { status: 0, weight: 0n }
  }
}

export const getAllGuardians = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<readonly Address[]> => {
  const address = getModuleAddress(await client.getChainId())
  try {
    return await client.readContract({
      address,
      abi,
      functionName: 'getAllGuardians',
      args: [account.address],
    })
  } catch (err) {
    return []
  }
}

export const hasGuardianVoted = async ({
  account,
  client,
  guardian,
}: {
  account: Account
  client: PublicClient
  guardian: Address
}): Promise<boolean> => {
  const address = getModuleAddress(await client.getChainId())
  try {
    return await client.readContract({
      address,
      abi,
      functionName: 'hasGuardianVoted',
      args: [account.address, guardian],
    })
  } catch (err) {
    return false
  }
}

export const getAddGuardianAction = async ({
  client,
  guardian,
  weight,
}: {
  client: PublicClient
  guardian: Address
  weight: bigint
}): Promise<Execution> => {
  const address = getModuleAddress(await client.getChainId())
  const data = encodeFunctionData({
    functionName: 'addGuardian',
    abi,
    args: [guardian, weight],
  })

  return {
    to: address,
    target: address,
    value: 0n,
    callData: data,
    data,
  }
}

export const getRemoveGuardianAction = async ({
  client,
  guardian,
}: {
  client: PublicClient
  guardian: Address
}): Promise<Execution> => {
  const address = getModuleAddress(await client.getChainId())
  const data = encodeFunctionData({
    functionName: 'removeGuardian',
    abi,
    args: [guardian],
  })

  return {
    to: address,
    target: address,
    value: 0n,
    callData: data,
    data,
  }
}

export const getChangeThresholdAction = async ({
  client,
  threshold,
}: {
  client: PublicClient
  threshold: bigint
}): Promise<Execution> => {
  const address = getModuleAddress(await client.getChainId())
  const data = encodeFunctionData({
    functionName: 'changeThreshold',
    abi,
    args: [threshold],
  })

  return {
    to: address,
    target: address,
    value: 0n,
    callData: data,
    data,
  }
}
