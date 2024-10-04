import { Address } from 'viem'

type SwapRouterAddresses = {
  [chainId: number]: Address
}

type SwapDetails = {
  sqrtPriceLimitX96: bigint
  amountOutMin: bigint
  fee: bigint
}

export const swapRouterAddresses: SwapRouterAddresses = {
  1: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  11155111: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  42161: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  421614: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  10: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  11155420: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  137: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  8453: '0x2626664c2603336E57B271c5C0b26F421741e481',
  84532: '0x94cC0AaC535CCDB3C01d6787D6413C739ae12bc4',
  56: '0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2',
  43114: '0xbb00FF08d01D300023C629E8fFfFcb65A5a578cE',
}

export const getSwapDetails = (): SwapDetails => {
  // todo: implement this
  return {
    sqrtPriceLimitX96: BigInt(0),
    amountOutMin: BigInt(0),
    fee: BigInt(0),
  }
}
