import { isAddress } from 'viem'
import { KernelModule, KernelModuleType } from '../types'

export function isKernelModule(object: unknown): object is KernelModule {
  const module = object as KernelModule
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
    isKernelModuleType(module.type)
  )
}

const isKernelModuleType = (value: unknown): value is KernelModuleType => {
  const validTypes: KernelModuleType[] = [
    'validator',
    'executor',
    'fallback',
    'hook',
    'policy',
    'signer',
  ]
  return (
    typeof value === 'string' && validTypes.includes(value as KernelModuleType)
  )
}
