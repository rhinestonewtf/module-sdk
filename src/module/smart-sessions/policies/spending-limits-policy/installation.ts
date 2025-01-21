import { Policy } from '../types'
import { Address, encodeAbiParameters } from 'viem'
import { GLOBAL_CONSTANTS } from 'src/constants'

type Params = {
  token: Address
  limit: bigint
}[]

export const getSpendingLimitsPolicy = (params: Params): Policy => {
  return {
    policy: GLOBAL_CONSTANTS.SPENDING_LIMITS_POLICY_ADDRESS,
    address: GLOBAL_CONSTANTS.SPENDING_LIMITS_POLICY_ADDRESS,
    initData: encodeAbiParameters(
      [{ type: 'address[]' }, { type: 'uint256[]' }],
      [params.map(({ token }) => token), params.map(({ limit }) => limit)],
    ),
  }
}
