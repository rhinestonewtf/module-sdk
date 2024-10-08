import { Address, encodeAbiParameters, Hex } from 'viem'
import { Module } from '../types'
import { HOOK_MULTI_PLEXER_ADDRESS } from './constants'
import { SigHookInit } from './types'

type Params = {
  globalHooks: Address[]
  valueHooks: Address[]
  delegatecallHooks: Address[]
  sigHooks: SigHookInit[]
  targetHooks: SigHookInit[]
  selector?: Hex
  hookType?: number
}

export const getHookMultiPlexer = ({
  globalHooks,
  valueHooks,
  delegatecallHooks,
  sigHooks,
  targetHooks,
  selector,
  hookType,
}: Params): Module => {
  return {
    address: HOOK_MULTI_PLEXER_ADDRESS,
    module: HOOK_MULTI_PLEXER_ADDRESS,
    initData: encodeAbiParameters(
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
    deInitData: '0x',
    additionalContext: '0x',
    type: 'hook',
    selector,
    hookType,
  }
}
