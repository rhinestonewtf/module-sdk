import { Hex, encodeAbiParameters } from 'viem'
import { Module } from '../types'
import { WEBAUTHN_VALIDATOR_ADDRESS } from './constants'

export type WebauthnCredential = {
  id: string
  publicKey: [Hex, Hex]
}

export const getWebauthnValidator = ({
  webAuthnCredential,
}: {
  webAuthnCredential: WebauthnCredential
}): Module => {
  return {
    module: WEBAUTHN_VALIDATOR_ADDRESS,
    data: encodeAbiParameters(
      [
        {
          components: [
            {
              name: 'pubKeyX',
              type: 'uint256',
            },
            {
              name: 'pubKeyY',
              type: 'uint256',
            },
            {
              name: 'keyId',
              type: 'string',
            },
          ],
          name: 'PassKeyId',
          type: 'tuple',
        },
      ],
      [
        {
          pubKeyX: BigInt(webAuthnCredential.publicKey[0]),
          pubKeyY: BigInt(webAuthnCredential.publicKey[1]),
          keyId: webAuthnCredential.id,
        },
      ],
    ),
    additionalContext: '0x',
    type: 'validator',
  }
}
