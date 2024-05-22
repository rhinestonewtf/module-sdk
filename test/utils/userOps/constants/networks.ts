import { Network } from '../types'

export const networks: Network[] = [
  {
    name: 'Sepolia',
    testnet: true,
    icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    bundlerUrl:
      'https://api.pimlico.io/v2/sepolia/rpc?apikey=3f08344c-182e-4a2f-adcd-32d1cd057158',
    rpcUrl: 'https://rpc.ankr.com/eth_sepolia',
    zeroExBaseUrl: 'https://sepolia.api.0x.org',
    id: 11_155_111,
    network: 'Sepolia',
    queryName: 'sepolia',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://rpc.ankr.com/eth_sepolia'],
      },
      public: {
        http: ['https://rpc.ankr.com/eth_sepolia'],
      },
    },
    blockExplorerUrl: 'https://sepolia.etherscan.io',
    explorerName: 'Etherscan',
  },
]

export const getNetwork = (chainId: number): Network => {
  return networks.find((network) => network.id === chainId) as Network
}
