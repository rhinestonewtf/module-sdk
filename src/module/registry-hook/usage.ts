import { Execution } from '../../account'
import { encodeFunctionData, Address } from 'viem'
import { abi } from './abi'
import { GLOBAL_CONSTANTS } from 'src/constants'

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
    to: GLOBAL_CONSTANTS.REGISTRY_HOOK_ADDRESS,
    target: GLOBAL_CONSTANTS.REGISTRY_HOOK_ADDRESS,
    value: BigInt(0),
    callData: data,
    data,
  }
}
