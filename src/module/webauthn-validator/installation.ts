import { Address, encodeAbiParameters, keccak256, toHex } from 'viem'
import { Module } from '../types'
import { WEBAUTHN_VALIDATOR_ADDRESS } from './constants'

export type WebauthnCredential = {
  pubKeyX: number | bigint
  pubKeyY: number | bigint
  authenticatorId: string
  hook?: Address
}

export const getWebAuthnValidator = (
  webAuthnCredential: WebauthnCredential,
): Module => {
  return {
    address: WEBAUTHN_VALIDATOR_ADDRESS,
    module: WEBAUTHN_VALIDATOR_ADDRESS,
    initData: encodeAbiParameters(
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
          pubKeyX: typeof webAuthnCredential.pubKeyX === 'bigint' ? webAuthnCredential.pubKeyX : BigInt(webAuthnCredential.pubKeyX),
          pubKeyY: typeof webAuthnCredential.pubKeyY === 'bigint' ? webAuthnCredential.pubKeyY : BigInt(webAuthnCredential.pubKeyY),
        },
        keccak256(toHex(webAuthnCredential.authenticatorId)),
      ],
    ),
    deInitData: '0x',
    hook: webAuthnCredential.hook,
    additionalContext: '0x',
    type: 'validator',
  }
}
