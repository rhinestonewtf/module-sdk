import { GLOBAL_CONSTANTS } from 'src/constants'
import { Policy } from '../types'
import { encodeAbiParameters } from 'viem'

type Params = {
  limit: bigint
}

export const getValueLimitPolicy = (params: Params): Policy => {
  return {
    policy: GLOBAL_CONSTANTS.VALUE_LIMIT_POLICY_ADDRESS,
    address: GLOBAL_CONSTANTS.VALUE_LIMIT_POLICY_ADDRESS,
    initData: encodeAbiParameters([{ type: 'uint256' }], [params.limit]),
  }
}
