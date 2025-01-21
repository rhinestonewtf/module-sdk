import { Policy } from '../types'
import { encodePacked } from 'viem'
import { GLOBAL_CONSTANTS } from 'src/constants'

type Params = {
  limit: bigint
}

export const getUsageLimitPolicy = (params: Params): Policy => {
  return {
    policy: GLOBAL_CONSTANTS.USAGE_LIMIT_POLICY_ADDRESS,
    address: GLOBAL_CONSTANTS.USAGE_LIMIT_POLICY_ADDRESS,
    initData: encodePacked(['uint128'], [params.limit]),
  }
}
