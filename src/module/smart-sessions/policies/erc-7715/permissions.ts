import { ActionData, ERC7739Data, PolicyData } from '../../types'

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
  return {
    userOpPolicies: [],
    erc7739Policies: {
      allowedERC7739Content: [],
      erc1271Policies: [],
    },
    actions: [],
  }
}
