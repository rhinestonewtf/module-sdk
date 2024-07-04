import { Address, encodeAbiParameters, keccak256, toHex } from 'viem'
import { Module } from '../types'
import { WEBAUTHN_VALIDATOR_ADDRESS } from './constants'

export type WebauthnCredential = {
  pubKeyX: number
  pubKeyY: number
  authenticatorId: string
  hook?: Address
}

export const getInstallWebAuthnValidator = (
  webAuthnCredential: WebauthnCredential,
): Module => {
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
          ],
          type: 'tuple',
        },
        {
          type: 'bytes32',
          name: 'authenticatorIdHash',
        },
      ],
      [
        {
          pubKeyX: BigInt(webAuthnCredential.pubKeyX),
          pubKeyY: BigInt(webAuthnCredential.pubKeyY),
        },
        keccak256(toHex(webAuthnCredential.authenticatorId)),
      ],
    ),
    hook: webAuthnCredential.hook,
    additionalContext: '0x',
    type: 'validator',
  }
}
