import { Address, encodeAbiParameters } from 'viem'
import { Module } from '../types'
import { HOOK_MULTI_PLEXER_ADDRESS } from './constants'
import { SigHookInit } from './types'

type Params = {
  globalHooks: Address[]
  valueHooks: Address[]
  delegatecallHooks: Address[]
  sigHooks: SigHookInit[]
  targetHooks: SigHookInit[]
}

export const getInstallHookMultiPlexer = ({
  globalHooks,
  valueHooks,
  delegatecallHooks,
  sigHooks,
  targetHooks,
}: Params): Module => {
  return {
    module: HOOK_MULTI_PLEXER_ADDRESS,
    data: encodeAbiParameters(
      [
        { internalType: 'address[]', name: 'globalHooks', type: 'address[]' },
        { internalType: 'address[]', name: 'valueHooks', type: 'address[]' },
        {
          internalType: 'address[]',
          name: 'delegatecallHooks',
          type: 'address[]',
        },
        {
          components: [
            { internalType: 'address[]', name: 'subHooks', type: 'address[]' },
            { internalType: 'bytes4', name: 'sig', type: 'bytes4' },
          ],
          name: 'sigHooks',
          type: 'tuple[]',
        },
        {
          components: [
            { internalType: 'address[]', name: 'subHooks', type: 'address[]' },
            { internalType: 'bytes4', name: 'sig', type: 'bytes4' },
          ],
          name: 'targetHooks',
          type: 'tuple[]',
        },
      ],
      [globalHooks, valueHooks, delegatecallHooks, sigHooks, targetHooks],
    ),
    additionalContext: '0x',
    type: 'hook',
  }
}
