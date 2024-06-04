import { Execution } from '../../account'
import { encodeFunctionData, Address } from 'viem'
import { abi } from './abi'
import { REGISTRY_HOOK_ADDRESS } from './constants'

export const getSetRegistryAction = ({
  registryAddress,
}: {
  registryAddress: Address
}): Execution => {
  return {
    target: REGISTRY_HOOK_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'setRegistry',
      abi,
      args: [registryAddress],
    }),
  }
}
