import { Address, encodeFunctionData, Hex, PublicClient } from 'viem'
import { HOOK_MULTI_PLEXER_ADDRESS } from './constants'
import { abi } from './abi'
import { Execution } from '../../account'
import { Account } from '../../account'
import { HookType } from './types'

export const getHooks = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<Address[]> => {
  try {
    const hooks = (await client.readContract({
      address: HOOK_MULTI_PLEXER_ADDRESS,
      abi,
      functionName: 'getHooks',
      args: [account.address],
    })) as Address[]

    return hooks
  } catch (err) {
    console.error(err)
    return []
  }
}

export const addHook = ({
  hook,
  hookType,
}: {
  hook: Address
  hookType: HookType
}): Execution => {
  try {
    return {
      target: HOOK_MULTI_PLEXER_ADDRESS,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: 'addHook',
        abi,
        args: [hook, hookType],
      }),
    }
  } catch {
    throw new Error(`Failed to add hook ${hook}`)
  }
}

export const addSigHook = ({
  hook,
  sig,
  hookType,
}: {
  hook: Address
  sig: Hex
  hookType: HookType
}): Execution => {
  try {
    return {
      target: HOOK_MULTI_PLEXER_ADDRESS,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: 'addSigHook',
        abi,
        args: [hook, sig, hookType],
      }),
    }
  } catch {
    throw new Error(`Failed to add sig hook ${hook}`)
  }
}

export const removeHook = ({
  hook,
  hookType,
}: {
  hook: Address
  hookType: HookType
}): Execution => {
  try {
    return {
      target: HOOK_MULTI_PLEXER_ADDRESS,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: 'removeHook',
        abi,
        args: [hook, hookType],
      }),
    }
  } catch {
    throw new Error(`Failed to remove hook ${hook}`)
  }
}

export const removeSigHook = ({
  hook,
  sig,
  hookType,
}: {
  hook: Address
  sig: Hex
  hookType: HookType
}): Execution => {
  try {
    return {
      target: HOOK_MULTI_PLEXER_ADDRESS,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: 'removeSigHook',
        abi,
        args: [hook, sig, hookType],
      }),
    }
  } catch {
    throw new Error(`Failed to add sig hook ${hook}`)
  }
}
