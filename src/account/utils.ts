import { Module, ModuleType } from '../module/types'
import { Account, AccountType } from './types'
import { isAddress } from 'viem'

export function isAccount(obj: unknown): obj is Account {
  const account = obj as Account
  return (
    typeof obj === 'object' &&
    obj !== null &&
    isAddress(account.address, { strict: false }) &&
    (account.initCode === undefined ||
      (account.initCode !== undefined &&
        typeof account.initCode === 'string' &&
        account.initCode.startsWith('0x'))) &&
    typeof account.type === 'string' &&
    isAccountType(account.type) &&
    Array.isArray(account.deployedOnChains) &&
    account.deployedOnChains.every((chainId) => typeof chainId === 'number')
  )
}

function isAccountType(value: unknown): value is AccountType {
  const validTypes: AccountType[] = [
    'erc7579-implementation',
    'kernel',
    'safe',
    'nexus',
  ]
  return typeof value === 'string' && validTypes.includes(value as AccountType)
}

export function isModule(object: unknown): object is Module {
  const module = object as Module
  return (
    typeof object === 'object' &&
    object !== null &&
    isAddress(module.address, { strict: false }) &&
    typeof module.initData === 'string' &&
    module.initData.startsWith('0x') &&
    typeof module.deInitData === 'string' &&
    module.deInitData.startsWith('0x') &&
    typeof module.additionalContext === 'string' &&
    module.additionalContext.startsWith('0x') &&
    isModuleType(module.type)
  )
}

const isModuleType = (value: unknown): value is ModuleType => {
  const validTypes: ModuleType[] = ['validator', 'executor', 'fallback', 'hook']
  return typeof value === 'string' && validTypes.includes(value as ModuleType)
}
