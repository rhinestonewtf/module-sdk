import { Address, Hex } from 'viem'

export type SigHookInit = {
  sig: Hex
  subHooks: Address[]
}

export enum HookType {
  GLOBAL,
  DELEGATECALL,
  VALUE,
  SIG,
  TARGET,
}
