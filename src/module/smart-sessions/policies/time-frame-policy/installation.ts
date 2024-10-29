import { TIME_FRAME_POLICY_ADDRESS } from './constants'
import { Policy } from '../types'
import { encodeAbiParameters } from 'viem'

type Params = {
  validUntil: number
  validAfter: number
}

export const getTimeFramePolicy = (param: Params): Policy => {
  return {
    policy: TIME_FRAME_POLICY_ADDRESS,
    address: TIME_FRAME_POLICY_ADDRESS,
    initData: encodeAbiParameters(
      [{ type: 'uint48' }, { type: 'uint48' }],
      [param.validAfter, param.validUntil],
    ),
  }
}
