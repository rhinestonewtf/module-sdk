import {
  Hex,
  decodeAbiParameters,
  decodeFunctionData,
  parseAbi,
  slice,
} from 'viem'
import { InitialModules } from '../../types'
import { Module } from '../../../module/types'
import { bootstrapAbi, factoryAbi } from '../constants/abis'

export const getInitData = ({
  initCode,
}: {
  initCode: Hex
}): InitialModules => {
  const { args: initCodeArgs } = decodeFunctionData({
    abi: parseAbi(factoryAbi),
    data: slice(initCode, 20),
  })

  if (initCodeArgs?.length !== 2) {
    throw new Error('Invalid init code')
  }

  const initCallData = decodeAbiParameters(
    [
      { name: 'bootstrap', type: 'address' },
      { name: 'initCallData', type: 'bytes' },
    ],
    initCodeArgs[1] as Hex,
  )

  const { args: initCallDataArgs } = decodeFunctionData({
    abi: parseAbi(bootstrapAbi),
    data: initCallData[1],
  })

  if (initCallDataArgs?.length !== 4) {
    throw new Error('Invalid init code')
  }

  return {
    validators: initCallDataArgs[0] as Module[],
    executors: initCallDataArgs[1] as Module[],
    hooks: [initCallDataArgs[2]] as Module[],
    fallbacks: initCallDataArgs[3] as Module[],
  }
}
