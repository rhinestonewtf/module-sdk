import { Policy } from '../types'
import { encodePacked } from 'viem'
import { GLOBAL_CONSTANTS } from '../../../../constants'

type Params = {
  validUntil: number
  validAfter: number
}

export const getTimeFramePolicy = (param: Params): Policy => {
  return {
    policy: GLOBAL_CONSTANTS.TIME_FRAME_POLICY_ADDRESS,
    address: GLOBAL_CONSTANTS.TIME_FRAME_POLICY_ADDRESS,
    initData: encodePacked(
      ['uint128', 'uint128'],
      [BigInt(param.validUntil), BigInt(param.validAfter)],
    ),
  }
}
