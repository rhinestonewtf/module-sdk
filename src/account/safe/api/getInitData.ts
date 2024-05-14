import { Hex } from 'viem'
import { InitialModules } from '../../types'

export const getInitData = (_: { initCode: Hex }): InitialModules => {
  // TODO: Implement it
  return {
    validators: [],
    executors: [],
    hooks: [],
    fallbacks: [],
  }
}
