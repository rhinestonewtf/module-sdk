import { Account, Action } from '../Account'
import { Address, Hex, PublicClient, encodeFunctionData } from 'viem'
import AccountInterface from '../constants/abis/ERC7579Interface.json'
import {
  isExecutorInstalled,
  isFallbackInstalled,
  isHookInstalled,
  isValidatorInstalled,
} from './isModuleInstalled'
import { Module } from '../../../module/common/Module'

export const installModule = ({
  client,
  account,
  module,
}: {
  client: PublicClient
  account: Account
  module: Module
}): Promise<Action[]> => {
  switch (module.type) {
    case 'validator':
      return installValidator(client, account, module.address, module.initData)
    case 'executor':
      return installExecutor(client, account, module.address, module.initData)
    case 'fallback':
      return installFallback(
        client,
        account,
        module.initData,
        false,
        module.address,
      )
    case 'hook':
      return installHook(client, account, module.address, module.initData)
    default:
      throw new Error(`Unknown module type ${module.type}`)
  }
}

async function installValidator(
  client: PublicClient,
  account: Account,
  validator: Address,
  initData: Hex,
): Promise<Action[]> {
  const actions: Action[] = []
  const isModuleInstalled = await isValidatorInstalled(
    client,
    account,
    validator,
  )

  if (!isModuleInstalled) {
    actions.push({
      target: account.address,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: 'installValidator',
        abi: AccountInterface.abi,
        args: [validator, initData],
      }),
    })
  }
  return actions
}

async function installExecutor(
  client: PublicClient,
  account: Account,
  executor: Address,
  initData: Hex,
): Promise<Action[]> {
  const actions: Action[] = []
  const isModuleInstalled = await isExecutorInstalled(client, account, executor)

  if (!isModuleInstalled) {
    actions.push({
      target: account.address,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: 'installExecutor',
        abi: AccountInterface.abi,
        args: [executor, initData],
      }),
    })
  }
  return actions
}

async function installFallback(
  client: PublicClient,
  account: Account,
  functionSelector: Hex,
  isStatic: boolean,
  subHandler: Address,
): Promise<Action[]> {
  const actions: Action[] = []
  // TODO: this only checks if the queried handler is installed, but the account will also revert if any other handler is installed

  // TODO

  // const isHandlerInstalled = await isFallbackInstalled(
  //   client,
  //   account,
  //   account.contractDependencies.EXTENSIBLE_FALLBACK_HANDLER_ADDRESS
  // );

  // if (!isHandlerInstalled) {
  //   actions.push({
  //     target: account.address,
  //     value: BigInt(0),
  //     callData: encodeFunctionData({
  //       functionName: "installFallback",
  //       abi: AccountInterface.abi,
  //       args: [
  //         account.contractDependencies.EXTENSIBLE_FALLBACK_HANDLER_ADDRESS,
  //         "0x",
  //       ],
  //     }),
  //   });
  // }

  // actions.push({
  //   target: account.contractDependencies.EXTENSIBLE_FALLBACK_HANDLER_ADDRESS,
  //   value: BigInt(0),
  //   callData: encodeFunctionData({
  //     functionName: "setFunctionSig",
  //     abi: ExtensibleFallbackHandler.abi,
  //     args: [
  //       {
  //         selector: functionSelector,
  //         fallbackType: BigInt(isStatic ? 0 : 1),
  //         handler: subHandler,
  //       },
  //     ],
  //   }),
  // });
  return actions
}

async function installHook(
  client: PublicClient,
  account: Account,
  hook: Address,
  initData: Hex,
): Promise<Action[]> {
  const actions: Action[] = []
  // TODO: this only checks if the queried hook is installed, but the account will also revert if any other hook is installed
  const isModuleInstalled = await isHookInstalled(client, account, hook)

  if (!isModuleInstalled) {
    actions.push({
      target: account.address,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: 'installHook',
        abi: AccountInterface.abi,
        args: [hook, initData],
      }),
    })
  }
  return actions
}
