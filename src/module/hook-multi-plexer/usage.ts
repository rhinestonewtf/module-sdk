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

export const getAddHookAction = ({
  hook,
  hookType,
  sig,
}: {
  hook: Address
  hookType: HookType
  sig?: Hex
}): Execution => {
  try {
    const data = encodeFunctionData({
      functionName: sig ? 'addSigHook' : 'addHook',
      abi,
      args: sig ? [hook, sig, hookType] : [hook, hookType],
    })

    return {
      to: HOOK_MULTI_PLEXER_ADDRESS,
      target: HOOK_MULTI_PLEXER_ADDRESS,
      value: BigInt(0),
      callData: data,
      data,
    }
  } catch {
    throw new Error(`Failed to add hook ${hook}`)
  }
}

export const getRemoveHookAction = ({
  hook,
  hookType,
  sig,
}: {
  hook: Address
  hookType: HookType
  sig?: Hex
}): Execution => {
  try {
    const data = encodeFunctionData({
      functionName: sig ? 'removeSigHook' : 'removeHook',
      abi,
      args: sig ? [hook, sig, hookType] : [hook, hookType],
    })

    return {
      to: HOOK_MULTI_PLEXER_ADDRESS,
      target: HOOK_MULTI_PLEXER_ADDRESS,
      value: BigInt(0),
      callData: data,
      data,
    }
  } catch {
    throw new Error(`Failed to remove hook ${hook}`)
  }
}
