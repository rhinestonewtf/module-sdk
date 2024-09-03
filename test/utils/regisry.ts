import { Execution } from 'src/account'
import { REGISTRY_ADDRESS } from 'src/module'
import { MOCK_ATTESTER_ADDRESS } from 'src/module/registry/constants'
import { abi } from 'src/module/registry/abi'
import { encodeFunctionData } from 'viem'

export const getTrustAttestersAction = (): Execution => {
  return {
    target: REGISTRY_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'trustAttesters',
      abi,
      args: [1, [MOCK_ATTESTER_ADDRESS]],
    }),
  }
}
