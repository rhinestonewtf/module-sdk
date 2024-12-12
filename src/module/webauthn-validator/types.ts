import { Address, type Hex } from 'viem'

export type WebauthnCredential = {
  pubKey: PublicKey | Hex | Uint8Array
  authenticatorId: string
  hook?: Address
}

export type WebauthnValidatorSignature = {
  webauthn: WebAuthnData
  signature: WebauthnSignature | Hex | Uint8Array
  usePrecompiled: boolean
}

export type WebAuthnData = {
  authenticatorData: Hex
  clientDataJSON: string
  typeIndex: number | bigint
}

export type WebauthnSignature = {
  r: bigint
  s: bigint
}

export type PublicKey = {
  prefix?: number | undefined
  x: bigint
  y: bigint
}
