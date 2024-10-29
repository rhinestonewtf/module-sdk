import { ActionData, ERC7739Data, PolicyData } from '../../types'
import { getSpendingLimitsPolicy } from '../spending-limits-policy'
import { getTimeFramePolicy } from '../time-frame-policy'
import { getUsageLimitPolicy } from '../usage-limit-policy'
import { getValueLimitPolicy } from '../value-limit-policy'

type ERC7715Permissions = {
  type: string
  data: any
}

type Policies = {
  userOpPolicies: PolicyData[]
  erc7739Policies: ERC7739Data
  actions: ActionData[]
}

export const getPermissions = ({
  permissions,
}: {
  permissions: ERC7715Permissions[]
}): Policies => {
  const userOpPolicies: PolicyData[] = []
  const erc7739Policies: ERC7739Data = {
    allowedERC7739Content: [],
    erc1271Policies: [],
  }
  const actions: ActionData[] = []

  for (const permission of permissions) {
    switch (permission.type) {
      case 'native-token-transfer':
        const valueLimitPolicy = getValueLimitPolicy({
          limit: permission.data.allowance,
        })
        userOpPolicies.push({
          policy: valueLimitPolicy.address,
          initData: valueLimitPolicy.initData,
        })
        break
      case 'erc20-token-transfer':
        const spendingLimitPolicy = getSpendingLimitsPolicy([
          { token: permission.data.address, limit: permission.data.allowance },
        ])
        userOpPolicies.push({
          policy: spendingLimitPolicy.address,
          initData: spendingLimitPolicy.initData,
        })
        break
      case 'usage-limit':
        const usageLimitPolicy = getUsageLimitPolicy({
          limit: permission.data.limit,
        })
        userOpPolicies.push({
          policy: usageLimitPolicy.address,
          initData: usageLimitPolicy.initData,
        })
        break
      case 'timeframe':
        const timeFramePolicy = getTimeFramePolicy({
          validUntil: permission.data.validUntil,
          validAfter: permission.data.validAfter,
        })
        userOpPolicies.push({
          policy: timeFramePolicy.address,
          initData: timeFramePolicy.initData,
        })
        break
    }
  }

  return {
    userOpPolicies: userOpPolicies,
    erc7739Policies: erc7739Policies,
    actions: actions,
  }
}
