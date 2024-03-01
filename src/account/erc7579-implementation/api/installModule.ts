import { Account, Action } from '../../Account'
import {
  Address,
  Hex,
  PublicClient,
  decodeAbiParameters,
  encodeAbiParameters,
  encodeFunctionData,
  encodePacked,
  slice,
} from 'viem'
import AccountInterface from '../constants/abis/ERC7579Implementation.json'
import ExtensibleFallbackHandler from '../constants/abis/ExtensibleFallbackHandler.json'
import { isModuleInstalled } from './isModuleInstalled'
import { Module, moduleTypeIds } from '../../../Module/Module'
import { FALLBACK_HANDLER } from '../constants/contracts'

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
    case 'executor':
    case 'hook':
      return _installModule({ client, account, module })
    case 'fallback':
      return installFallback({ client, account, module })
    default:
      throw new Error(`Unknown module type ${module.type}`)
  }
}

const _installModule = async ({
  client,
  account,
  module,
}: {
  client: PublicClient
  account: Account
  module: Module
}) => {
  const actions: Action[] = []
  const isInstalled = await isModuleInstalled({ client, account, module })

  if (!isInstalled) {
    actions.push({
      target: account.address,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: 'installModule',
        abi: AccountInterface.abi,
        args: [moduleTypeIds[module.type], module.module, module.data || '0x'],
      }),
    })
  }
  return actions
}

async function installFallback({
  client,
  account,
  module,
}: {
  client: PublicClient
  account: Account
  module: Module
}): Promise<Action[]> {
  const actions: Action[] = []

  const _params = decodeAbiParameters(
    [
      { name: 'functionSigs', type: 'bytes32' },
      { name: 'calltype', type: 'bytes1' },
      { name: 'initData', type: 'bytes' },
    ],
    module.data!,
  ) as [Hex, Hex, Hex]

  const selectors: Hex[] = []

  for (let i = 0; i < _params[0].length; i += 4) {
    const functionSelector = slice(_params[0], i, i + 4)
    const selector = encodeAbiParameters(
      [{ name: 'functionSignature', type: 'bytes4' }],
      [functionSelector],
    )
    const isInstalled = await isModuleInstalled({
      client,
      account,
      module: { ...module, additionalContext: selector },
    })
    if (!isInstalled) {
      selectors.push(selector)
    }
  }

  if (selectors.length > 0) {
    const encodedSelectors = encodePacked(
      ['bytes4'.repeat(selectors.length)],
      // @ts-ignore
      selectors,
    )
    const params = encodeAbiParameters(
      [
        { name: 'functionSigs', type: 'bytes32' },
        { name: 'calltype', type: 'bytes1' },
        { name: 'initData', type: 'bytes' },
      ],
      [encodedSelectors, _params[1], _params[2]],
    )
    actions.push({
      target: account.address,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: 'installModule',
        abi: AccountInterface.abi,
        args: [moduleTypeIds[module.type], module.module, params],
      }),
    })
  }
  return actions
}
