import { Account } from 'src/account/types'

export const MockAccountDeployed: Account = {
  address: '0x7227dcfb0c5ec7a5f539f97b18be261c49687ed6',
  deployedOnChains: [11155111],
  type: 'erc7579-implementation',
}

export const MockKernelAccountDeployed: Account = {
  address: '0xee0cbe5e9c49a2cc31881ab9c26e662be68e85dd',
  deployedOnChains: [11155111],
  type: 'kernel',
}

export const MockSafeAccountDeployed: Account = {
  address: '0xc2b17e73603dccc195118a36f3203134fd7985f5',
  deployedOnChains: [11155111],
  type: 'safe',
}

export const MockNexusAccountDeployed: Account = {
  address: '0xD13D10447C8684D7793715272A57C2E35ae63823',
  deployedOnChains: [11155111],
  type: 'nexus',
}
