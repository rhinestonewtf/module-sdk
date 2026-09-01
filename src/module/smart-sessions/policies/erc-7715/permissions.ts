import { toFunctionSelector } from 'viem'
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

// ERC20SpendingLimitPolicy (see `rhinestonewtf/smartsessions`) implements IActionPolicy only, not
// IUserOpPolicy - it must be scoped to a specific action (target + selector), never placed in
// userOpPolicies, or SmartSession's `enableSessions`/`onInstall` reverts with `UnsupportedPolicy`.
//
// Deliberately scoped to `transfer` only, not `approve`/`transferFrom`/`increaseAllowance` (all of
// which the on-chain policy also accepts). The ERC-7715 `erc20-token-transfer` permission type is
// requesting the ability to *transfer* tokens; granting `approve` as a side effect would hand the
// session a persistent third-party spending authority the caller never asked for. Callers that need
// an allowance-granting session should request it explicitly via a separate permission/action.
const ERC20_TRANSFER_SELECTOR = toFunctionSelector(
  'function transfer(address,uint256)',
)

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
        actions.push({
          actionTarget: permission.data.address,
          actionTargetSelector: ERC20_TRANSFER_SELECTOR,
          actionPolicies: [
            {
              policy: spendingLimitPolicy.address,
              initData: spendingLimitPolicy.initData,
            },
          ],
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
