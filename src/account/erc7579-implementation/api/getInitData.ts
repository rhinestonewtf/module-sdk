import { Hex, decodeAbiParameters, decodeFunctionData, slice } from 'viem'
import { InitialModules } from '../../Account'
import AccountFactory from '../constants/abis/AccountFactory.json'
import Bootstrap from '../constants/abis/Bootstrap.json'
import { Module } from '../../../module/Module'

export const getInitData = ({
  initCode,
}: {
  initCode: Hex
}): InitialModules => {
  const { args: initCodeArgs } = decodeFunctionData({
    abi: AccountFactory.abi,
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
    abi: Bootstrap.abi,
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
