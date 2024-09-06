import { SPENDING_LIMITS_POLICY_ADDRESS } from './constants'
import { Policy } from '../types'
import { Address, encodeAbiParameters } from 'viem'

type Params = {
  token: Address
  limit: bigint
}[]

export const getSpendingLimitsPolicy = (params: Params): Policy => {
  return {
    address: SPENDING_LIMITS_POLICY_ADDRESS,
    initData: encodeAbiParameters(
      [{ type: 'address[]' }, { type: 'uint256[]' }],
      [params.map(({ token }) => token), params.map(({ limit }) => limit)],
    ),
    deInitData: '0x',
  }
}
