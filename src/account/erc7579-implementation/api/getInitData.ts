import {
  Hex,
  decodeAbiParameters,
  decodeFunctionData,
  parseAbi,
  slice,
} from 'viem'
import { InitialModules } from '../../types'
import { Module } from '../../../module/types'

export const getInitData = ({
  initCode,
}: {
  initCode: Hex
}): InitialModules => {
  const { args: initCodeArgs } = decodeFunctionData({
    abi: parseAbi([
      'function createAccount(bytes32 salt,bytes calldata initCode)',
    ]),
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
    abi: parseAbi([
      'function singleInitMSA(address validator, bytes calldata data)',
      'function initMSA(BootstrapConfig[] calldata $valdiators,BootstrapConfig[] calldata $executors,BootstrapConfig calldata _hook,BootstrapConfig[] calldata _fallbacks)',
      'struct BootstrapConfig {address module;bytes data;}',
    ]),
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
