import { Address, PublicClient } from 'viem'
import { Account, Action } from '../Account'
import { Module, ModuleType } from '../../Module/Module'
import { getInstalledModules } from './api/getInstalledModules'
import { installModule } from './api/installModule'
import { isModuleInstalled } from './api/isModuleInstalled'
import { uninstallModule } from './api/uninstallModule'

export class ERC7579Implementation {
  getInstalledModules = async ({
    client,
    account,
    moduleTypes,
  }: {
    client: PublicClient
    account: Account
    moduleTypes?: ModuleType[]
  }): Promise<Address[]> => {
    return getInstalledModules({ client, account, moduleTypes })
  }

  installModule = ({
    client,
    account,
    module,
  }: {
    client: PublicClient
    account: Account
    module: Module
  }): Promise<Action[]> => {
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
  }): Promise<Action[]> => {
    return uninstallModule({ client, account, module })
  }
}
