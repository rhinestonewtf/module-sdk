import { Address, encodeAbiParameters } from 'viem'
import { Module } from '../types'
import { AUTO_SAVINGS_ADDRESS } from './constants'

type Params = {
  tokens: Address[]
  configs: {
    percentage: number
    vault: Address
    sqrtPriceLimitX96: bigint
  }[]
  hook?: Address
}

export const getInstallAutoSavingsExecutor = ({
  tokens,
  configs,
  hook,
}: Params): Module => {
  return {
    module: AUTO_SAVINGS_ADDRESS,
    data: encodeAbiParameters(
      [
        { internalType: 'address[]', name: '_tokens', type: 'address[]' },
        {
          components: [
            { internalType: 'uint16', name: 'percentage', type: 'uint16' },
            { internalType: 'address', name: 'vault', type: 'address' },
            {
              internalType: 'uint128',
              name: 'sqrtPriceLimitX96',
              type: 'uint128',
            },
          ],
          internalType: 'struct AutoSavings.Config[]',
          name: '_configs',
          type: 'tuple[]',
        },
      ],
      [tokens, configs],
    ),
    additionalContext: '0x',
    type: 'executor',
    hook,
  }
}
