import { Address } from 'viem'
import { Account } from '../../types'

import { getInstalledModules as getInstalledModulesQuery } from '../../../../src/common/queries/account'

export const getInstalledModules = async ({
  account,
}: {
  account: Account
}): Promise<Address[]> => {
  return getInstalledModulesQuery({ account })
}
