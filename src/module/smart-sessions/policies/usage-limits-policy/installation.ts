import { USAGE_LIMIT_POLICY_ADDRESS } from './constants'
import { Policy } from '../types'
import { Address, encodeAbiParameters } from 'viem'

type Params = {
  limit: bigint
}

export const getUsageLimitPolicy = (params: Params): Policy => {
  return {
    policy: USAGE_LIMIT_POLICY_ADDRESS,
    address: USAGE_LIMIT_POLICY_ADDRESS,
    initData: encodeAbiParameters([{ type: 'uint128' }], [params.limit]),
  }
}
