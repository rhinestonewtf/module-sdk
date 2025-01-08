import { Account, AccountType } from './types'
import { isAddress } from 'viem'

export function isAccount(obj: unknown): obj is Account {
  const account = obj as Account
  return (
    typeof obj === 'object' &&
    obj !== null &&
    isAddress(account.address) &&
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
