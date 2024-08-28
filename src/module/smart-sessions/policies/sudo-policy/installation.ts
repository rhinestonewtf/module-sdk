import { SUDO_POLICY_ADDRESS } from './constants'
import { Policy } from '../../../types'

export const getSudoPolicy = (): Policy => {
  return {
    address: SUDO_POLICY_ADDRESS,
    initData: '0x',
    deInitData: '0x',
  }
}
