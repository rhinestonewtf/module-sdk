import { TIME_FRAME_POLICY_ADDRESS } from './constants'
import { Policy } from '../types'
import { encodePacked } from 'viem'

type Params = {
  validUntil: number
  validAfter: number
}

export const getTimeFramePolicy = (param: Params): Policy => {
  return {
    policy: TIME_FRAME_POLICY_ADDRESS,
    address: TIME_FRAME_POLICY_ADDRESS,
    initData: encodePacked(
      ['uint128', 'uint128'],
      [BigInt(param.validUntil), BigInt(param.validAfter)],
    ),
  }
}
