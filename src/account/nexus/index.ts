import { Address, Hex, PublicClient } from 'viem'
import {
  Account,
  Execution,
  ERC1271SignatureParams,
  ERC1271HashParams,
} from '../types'
import { Module, ModuleType } from '../../module/types'
import { getInstalledModules } from './api/getInstalledModules'
import { installModule } from './api/installModule'
import { isModuleInstalled } from './api/isModuleInstalled'
import { uninstallModule } from './api/uninstallModule'
import { encode1271Signature } from './api/encode1271Signature'
import { encode1271Hash } from './api/encode1271Hash'
import { encodeModuleInstallationData } from './api/encodeModuleInstallationData'
import { encodeModuleUninstallationData } from './api/encodeModuleUninstallationData'
import { encodeValidatorNonce } from './api/encodeValidatorNonce'

export class NexusImplementation {
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
    account,
    validator,
    signature,
  }: ERC1271SignatureParams): Hex => {
    return encode1271Signature({ account, validator, signature })
  }

  encode1271Hash = ({
    account,
    chainId,
    validator,
    hash,
  }: ERC1271HashParams): Hex => {
    return encode1271Hash({ account, chainId, validator, hash })
  }

  encodeModuleInstallationData = ({
    account,
    module,
  }: {
    account: Account
    module: Module
  }): Hex => {
    return encodeModuleInstallationData({ account, module })
  }

  encodeModuleUninstallationData = async ({
    client,
    account,
    module,
  }: {
    client: PublicClient
    account: Account
    module: Module
  }): Promise<Hex> => {
    return await encodeModuleUninstallationData({ client, account, module })
  }

  encodeValidatorNonce = ({ validator }: { validator: Module }): bigint => {
    return encodeValidatorNonce({ validator })
  }
}
