import { Policy } from '../types'
import { GLOBAL_CONSTANTS } from '../../../../constants'

export const getSudoPolicy = (): Policy => {
  return {
    policy: GLOBAL_CONSTANTS.SUDO_POLICY_ADDRESS,
    address: GLOBAL_CONSTANTS.SUDO_POLICY_ADDRESS,
    initData: '0x',
  }
}
