import { Network } from '../types'

export const networks: Network[] = [
  {
    id: 11_155_111,
  },
]

export const getNetwork = (chainId: number): Network => {
  return networks.find((network) => network.id === chainId) as Network
}
