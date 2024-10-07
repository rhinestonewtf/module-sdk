import { Execution } from '../../account'
import { encodeFunctionData, Address } from 'viem'
import { abi } from './abi'
import { REGISTRY_HOOK_ADDRESS } from './constants'

export const getSetRegistryAction = ({
  registryAddress,
}: {
  registryAddress: Address
}): Execution => {
  const data = encodeFunctionData({
    functionName: 'setRegistry',
    abi,
    args: [registryAddress],
  })

  return {
    to: REGISTRY_HOOK_ADDRESS,
    target: REGISTRY_HOOK_ADDRESS,
    value: BigInt(0),
    callData: data,
    data,
  }
}
