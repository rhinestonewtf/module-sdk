import { Address, PublicClient } from 'viem'
import { Account, Execution } from '../types'
import { Module, ModuleType } from '../../module/types'
import { getInstalledModules } from './api/getInstalledModules'
import { installModule } from './api/installModule'
import { isModuleInstalled } from './api/isModuleInstalled'
import { uninstallModule } from './api/uninstallModule'

export class KernelImplementation {
  getInstalledModules = async ({
    account,
  }: {
    client: PublicClient
    account: Account
    moduleTypes?: ModuleType[]
  }): Promise<Address[]> => {
    return getInstalledModules({ account })
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
}
