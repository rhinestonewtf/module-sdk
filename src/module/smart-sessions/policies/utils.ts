import { Hex, toHex } from 'viem'

export const bigIntToBytes32 = (value: bigint): Hex => {
  return toHex(value, { size: 32 }) as Hex
}
