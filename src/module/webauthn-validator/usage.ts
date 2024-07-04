import { encodeAbiParameters, Hex } from 'viem'

export const getWebauthnValidatorSignature = ({
  authenticatorData,
  clientDataJSON,
  responseTypeLocation,
  r,
  s,
  usePrecompiled,
}: {
  authenticatorData: Hex
  clientDataJSON: string
  responseTypeLocation: number
  r: number
  s: number
  usePrecompiled: boolean
}) => {
  return encodeAbiParameters(
    [
      { type: 'bytes', name: 'authenticatorData' },
      {
        type: 'string',
        name: 'clientDataJSON',
      },
      {
        type: 'uint256',
        name: 'responseTypeLocation',
      },
      {
        type: 'uint256',
        name: 'r',
      },
      {
        type: 'uint256',
        name: 's',
      },
      {
        type: 'bool',
        name: 'usePrecompiled',
      },
    ],
    [
      authenticatorData,
      clientDataJSON,
      BigInt(responseTypeLocation),
      BigInt(r),
      BigInt(s),
      usePrecompiled,
    ],
  )
}

export const getWebauthnValidatorMockSignature = (): Hex => {
  return '0x00000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000001161757468656e74696361746f7244617461000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e636c69656e744461746148617368000000000000000000000000000000000000'
}
