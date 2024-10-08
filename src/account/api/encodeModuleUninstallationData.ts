import { Hex, PublicClient } from 'viem'
import { Account } from '../types'
import { getAccountImplementation } from './getAccountImplementation'
import { Module } from '../../module/types'

export const encodeModuleUninstallationData = async ({
  client,
  account,
  module,
}: {
  client: PublicClient
  account: Account
  module: Module
}): Promise<Hex> => {
  const accountImplementation = getAccountImplementation({ account })
  return await accountImplementation.encodeModuleUninstallationData({
    client,
    account,
    module,
  })
}
