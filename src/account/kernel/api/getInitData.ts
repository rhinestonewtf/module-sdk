import {
  Hex,
  // decodeAbiParameters,
  // decodeFunctionData,
  // parseAbi,
  // slice,
} from 'viem'
import { InitialModules } from '../../types'
// import { Module } from '../../../module/types'
// import { bootstrapAbi, factoryAbi } from '../constants/abis'

export const getInitData = (_: { initCode: Hex }): InitialModules => {
  // TODO: Implement this function
  return {
    validators: [],
    executors: [],
    hooks: [],
    fallbacks: [],
  }
}
