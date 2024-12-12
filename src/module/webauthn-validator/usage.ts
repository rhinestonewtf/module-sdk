import { encodeAbiParameters, Hex } from 'viem'
import { WebauthnValidatorSignature } from './types'
import { parseSignature } from './utils'


export const getWebauthnValidatorSignature = ({
  webauthn,
  signature,
  usePrecompiled,
}: WebauthnValidatorSignature) => {
  const { authenticatorData, clientDataJSON, typeIndex } = webauthn
  let r: bigint
  let s: bigint
  if (typeof signature === 'string' || signature instanceof Uint8Array) {
    const parsedSignature = parseSignature(signature)
    r = parsedSignature.r
    s = parsedSignature.s
  } else {
    r = signature.r
    s = signature.s
  }
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
      typeof typeIndex === 'bigint' ? typeIndex : BigInt(typeIndex),
      r,
      s,
      usePrecompiled,
    ],
  )
}

export const getWebauthnValidatorMockSignature = (): Hex => {
  return '0x00000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000001635bc6d0f68ff895cae8a288ecf7542a6a9cd555df784b73e1e2ea7e9104b1db15e9015d280cb19527881c625fee43fd3a405d5b0d199a8c8e6589a7381209e40000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002549960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97631d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f47b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a22746278584e465339585f3442797231634d77714b724947422d5f3330613051685a36793775634d30424f45222c226f726967696e223a22687474703a2f2f6c6f63616c686f73743a33303030222c2263726f73734f726967696e223a66616c73652c20226f746865725f6b6579735f63616e5f62655f61646465645f68657265223a22646f206e6f7420636f6d7061726520636c69656e74446174614a534f4e20616761696e737420612074656d706c6174652e205365652068747470733a2f2f676f6f2e676c2f796162506578227d000000000000000000000000'
}
