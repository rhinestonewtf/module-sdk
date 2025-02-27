import { Address } from 'viem'
import { getClient } from 'src'
import { MockClient } from '../../../utils/mocks/client'
import { getAccount } from 'src'
import { MockAccountDeployed } from '../../../utils/mocks/account'
import { getHookMultiPlexer } from 'src/module'
import { getAddHookAction, getHooks, getRemoveHookAction } from 'src'
import { HookType } from 'src'
import { SigHookInit } from 'src/module'
import { GLOBAL_CONSTANTS } from 'src'

describe('Hook MultiPlexer Module', () => {
  // Setup
  const client = getClient(MockClient)
  const account = getAccount(MockAccountDeployed)

  const hooks = {
    globalHooks: ['0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3'] as Address[],
    valueHooks: ['0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3'] as Address[],
    delegatecallHooks: [
      '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3',
    ] as Address[],
    sigHooks: [
      {
        subHooks: ['0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3'],
        sig: '0x12434334',
      } as SigHookInit,
    ],
    targetHooks: [
      {
        subHooks: ['0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3'],
        sig: '0x12434334',
      } as SigHookInit,
    ],
  }

  it('should get install hook multi plexer module', async () => {
    const installHookMultiPlexerModule = getHookMultiPlexer(hooks)

    expect(installHookMultiPlexerModule.module).toEqual(
      GLOBAL_CONSTANTS.HOOK_MULTI_PLEXER_ADDRESS,
    )
    expect(installHookMultiPlexerModule.initData).toBeDefined()
    expect(installHookMultiPlexerModule.type).toEqual('hook')
  })

  it('should get added hooks', async () => {
    const addedHooks = (await getHooks({
      account,
      client,
    })) as Address[]

    expect(addedHooks.length).toEqual(0)
  })

  it('should get addHook execution', async () => {
    const addHookExecution = getAddHookAction({
      hook: hooks.globalHooks[0],
      hookType: HookType.GLOBAL,
    })

    expect(addHookExecution.target).toEqual(
      GLOBAL_CONSTANTS.HOOK_MULTI_PLEXER_ADDRESS,
    )
    expect(addHookExecution.value).toEqual(BigInt(0))
    expect(addHookExecution.callData).toBeDefined()
  })

  it('should get addSigHook execution', async () => {
    const addSigHookExecution = getAddHookAction({
      hook: hooks.sigHooks[0].subHooks[0],
      sig: hooks.sigHooks[0].sig,
      hookType: HookType.SIG,
    })

    expect(addSigHookExecution.target).toEqual(
      GLOBAL_CONSTANTS.HOOK_MULTI_PLEXER_ADDRESS,
    )
    expect(addSigHookExecution.value).toEqual(BigInt(0))
    expect(addSigHookExecution.callData).toBeDefined()
  })

  it('should get removeHook execution', async () => {
    const removeHookExecution = getRemoveHookAction({
      hook: hooks.globalHooks[0],
      hookType: HookType.GLOBAL,
    })

    expect(removeHookExecution.target).toEqual(
      GLOBAL_CONSTANTS.HOOK_MULTI_PLEXER_ADDRESS,
    )
    expect(removeHookExecution.value).toEqual(BigInt(0))
    expect(removeHookExecution.callData).toBeDefined()
  })

  it('should get removeSigHook execution', async () => {
    const removeSigHookExecution = getRemoveHookAction({
      hook: hooks.sigHooks[0].subHooks[0],
      sig: hooks.sigHooks[0].sig,
      hookType: HookType.SIG,
    })

    expect(removeSigHookExecution.target).toEqual(
      GLOBAL_CONSTANTS.HOOK_MULTI_PLEXER_ADDRESS,
    )
    expect(removeSigHookExecution.value).toEqual(BigInt(0))
    expect(removeSigHookExecution.callData).toBeDefined()
  })
})
