import { VALUE_LIMIT_POLICY_ADDRESS } from './constants'
import { Policy } from '../types'
import { encodeAbiParameters } from 'viem'

type Params = {
  limit: bigint
}

export const getValueLimitPolicy = (params: Params): Policy => {
  return {
    policy: VALUE_LIMIT_POLICY_ADDRESS,
    address: VALUE_LIMIT_POLICY_ADDRESS,
    initData: encodeAbiParameters([{ type: 'uint256' }], [params.limit]),
  }
}
