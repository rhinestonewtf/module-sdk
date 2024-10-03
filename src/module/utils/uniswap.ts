import { Address } from 'viem'

type SwapRouterAddresses = {
  [chainId: number]: Address
}

type SwapDetails = {
  sqrtPriceLimitX96: bigint
  amountOutMin: bigint
  fee: bigint
}

// todo: add swap router addresses
export const swapRouterAddresses: SwapRouterAddresses = {
  1: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  11155111: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
}

export const getSwapDetails = (): SwapDetails => {
  // todo: implement this
  return {
    sqrtPriceLimitX96: BigInt(0),
    amountOutMin: BigInt(0),
    fee: BigInt(0),
  }
}
