import { Address, encodeAbiParameters } from 'viem'
import { Module } from '../types'
import { AUTO_SAVINGS_ADDRESS } from './constants'
import { swapRouterAddresses } from '../utils/uniswap'

type Params = {
  chainId: number
  configs: {
    token: Address
    percentage: bigint
    vault: Address
  }[]
  hook?: Address
}

export const getAutoSavingsExecutor = ({
  chainId,
  configs,
  hook,
}: Params): Module => {
  const swapRouter: Address = swapRouterAddresses[chainId]
  if (!swapRouter) {
    throw new Error(`Swap router address not found for chainId ${chainId}`)
  }

  return {
    address: AUTO_SAVINGS_ADDRESS,
    module: AUTO_SAVINGS_ADDRESS,
    initData: encodeAbiParameters(
      [
        { internalType: 'address', name: 'swapRouter', type: 'address' },
        {
          components: [
            { internalType: 'address', name: 'token', type: 'address' },
            { internalType: 'uint64', name: 'percentage', type: 'uint64' },
            { internalType: 'address', name: 'vault', type: 'address' },
          ],
          internalType: 'struct AutoSavings.ConfigWithToken[]',
          name: '_configs',
          type: 'tuple[]',
        },
      ],
      [swapRouter, configs],
    ),
    deInitData: '0x',
    additionalContext: '0x',
    type: 'executor',
    hook,
  }
}
