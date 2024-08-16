import { PublicClient, Address, getAddress } from 'viem'
import { Module } from '..'
import { SENTINEL_ADDRESS } from './constants'
import { getInstalledModules } from './queries'
import { Account } from '../account'

export const getPreviousModule = async ({
  account,
  module,
  client,
}: {
  client: PublicClient
  account: Account
  module: Module
}): Promise<Address> => {
  let installedModules = await getInstalledModules({
    client,
    account,
  })
  const index = installedModules.indexOf(getAddress(module.module))
  if (index === 0) {
    return SENTINEL_ADDRESS
  } else if (index > 0) {
    return installedModules[index - 1]
  } else {
    throw new Error(`Module ${module.module} not found in installed modules`)
  }
}
