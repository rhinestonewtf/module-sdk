import { Address, Hex, PublicClient } from 'viem'
import { Account, Execution, Signature1271Params } from '../types'
import { Module, ModuleType } from '../../module/types'
import { getInstalledModules } from './api/getInstalledModules'
import { installModule } from './api/installModule'
import { isModuleInstalled } from './api/isModuleInstalled'
import { uninstallModule } from './api/uninstallModule'
import { encode1271Signature } from './api/encode1271Signature'

export class ERC7579Implementation {
  getInstalledModules = async ({
    account,
    client,
  }: {
    client: PublicClient
    account: Account
    moduleTypes?: ModuleType[]
  }): Promise<Address[]> => {
    return getInstalledModules({ account, client })
  }

  installModule = ({
    client,
    account,
    module,
  }: {
    client: PublicClient
    account: Account
    module: Module
  }): Promise<Execution[]> => {
    return installModule({ client, account, module })
  }

  isModuleInstalled = ({
    client,
    account,
    module,
  }: {
    client: PublicClient
    account: Account
    module: Module
  }): Promise<boolean> => {
    return isModuleInstalled({ client, account, module })
  }

  uninstallModule = ({
    client,
    account,
    module,
  }: {
    client: PublicClient
    account: Account
    module: Module
  }): Promise<Execution[]> => {
    return uninstallModule({ client, account, module })
  }

  encode1271Signature = ({
    validator,
    signature,
  }: Signature1271Params): Hex => {
    return encode1271Signature({ validator, signature })
  }
}
