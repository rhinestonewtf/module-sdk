import { Address, encodeAbiParameters, keccak256, hexToBytes, bytesToHex, toHex, type Hex } from 'viem'
import { Module } from '../types'
import { WEBAUTHN_VALIDATOR_ADDRESS } from './constants'

export type WebauthnCredential = {
  pubKey: Hex | PublicKey,
  authenticatorId: string
  hook?: Address
}

export type PublicKey = {
  prefix?: number | undefined
  x: bigint
  y: bigint
}

function parsePublicKey(publicKey: Hex | Uint8Array): PublicKey {
  const bytes =
    typeof publicKey === 'string' ? hexToBytes(publicKey) : publicKey
  const offset = bytes.length === 65 ? 1 : 0
  const x = bytes.slice(offset, 32 + offset)
  const y = bytes.slice(32 + offset, 64 + offset)
  return {
    prefix: bytes.length === 65 ? bytes[0] : undefined,
    x: BigInt(bytesToHex(x)),
    y: BigInt(bytesToHex(y)),
  }
}

export const getWebAuthnValidator = (
  webAuthnCredential: WebauthnCredential,
): Module => {
  let pubKeyX: bigint
  let pubKeyY: bigint

  // Distinguish between PublicKey and Hex encoded public key
  if (typeof webAuthnCredential.pubKey === 'string') {
    // It's a P256Credential
    const { x, y, prefix } = parsePublicKey(webAuthnCredential.pubKey)
    pubKeyX = x
    pubKeyY = y
    if (prefix && prefix !== 4) {
      throw new Error('Only uncompressed public keys are supported')
    }
  } else {
    // It's already a PublicKey
    pubKeyX = webAuthnCredential.pubKey.x
    pubKeyY = webAuthnCredential.pubKey.y
  }

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
          pubKeyX,
          pubKeyY,
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
