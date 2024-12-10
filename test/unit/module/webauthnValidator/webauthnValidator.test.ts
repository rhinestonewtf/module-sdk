import {
  WEBAUTHN_VALIDATOR_ADDRESS,
  getWebAuthnValidator,
  getWebauthnValidatorSignature,
} from 'src/module'
import { toHex, concatHex, toBytes, type Hex } from 'viem'

function serializePublicKey(x: bigint, y: bigint, prefix?: number, asBytes: boolean = false): Hex | Uint8Array {
  let hexKey = concatHex([toHex(x, { size: 32 }), toHex(y, { size: 32 })])
  if (prefix) {
    hexKey = concatHex([toHex(prefix, { size: 1 }), hexKey])
  }
  return asBytes ? toBytes(hexKey) : hexKey
}

describe('Webauthn Validator Module', () => {
  // Setup
  const credentials = {
    pubKey: {
      x: 123n,
      y: 456n,
    },
    authenticatorId: 'authenticatorId',
  }

  it('should get install webauthn validator module', async () => {
    const installWebauthnValidatorModule = getWebAuthnValidator({
      pubKey: {
        x: credentials.pubKey.x,
        y: credentials.pubKey.y,
      },
      authenticatorId: credentials.authenticatorId,
    })

    expect(installWebauthnValidatorModule.module).toEqual(
      WEBAUTHN_VALIDATOR_ADDRESS,
    )
    expect(installWebauthnValidatorModule.initData).toBeDefined()
    expect(installWebauthnValidatorModule.type).toEqual('validator')
  })

  it('should get install webauthn validator module with packed P256Credential', async () => {
    const pubKey = serializePublicKey(credentials.pubKey.x, credentials.pubKey.y)
    const installWebauthnValidatorModule = getWebAuthnValidator({
      pubKey,
      authenticatorId: credentials.authenticatorId,
    })

    expect(installWebauthnValidatorModule.module).toEqual(
      WEBAUTHN_VALIDATOR_ADDRESS,
    )
    expect(installWebauthnValidatorModule.initData).toBeDefined()
    expect(installWebauthnValidatorModule.type).toEqual('validator')
  })

  it('should get install webauthn validator module with packed P256Credential as Uint8Array', async () => {
    const pubKey = serializePublicKey(credentials.pubKey.x, credentials.pubKey.y, undefined, true)
    const installWebauthnValidatorModule = getWebAuthnValidator({
      pubKey,
      authenticatorId: credentials.authenticatorId,
    })

    expect(installWebauthnValidatorModule.module).toEqual(
      WEBAUTHN_VALIDATOR_ADDRESS,
    )
    expect(installWebauthnValidatorModule.initData).toBeDefined()
    expect(installWebauthnValidatorModule.type).toEqual('validator')
  })

  it('should get install webauthn validator module with prefix-packed P256Credential', async () => {
    const pubKey = serializePublicKey(credentials.pubKey.x, credentials.pubKey.y, 4)
    const installWebauthnValidatorModule = getWebAuthnValidator({
      pubKey,
      authenticatorId: credentials.authenticatorId,
    })

    expect(installWebauthnValidatorModule.module).toEqual(
      WEBAUTHN_VALIDATOR_ADDRESS,
    )
    expect(installWebauthnValidatorModule.initData).toBeDefined()
    expect(installWebauthnValidatorModule.type).toEqual('validator')
  })

  it('should throw error on install webauthn validator module with non-P256 pubkey', async () => {
    const pubKey = serializePublicKey(credentials.pubKey.x, credentials.pubKey.y, 1)
    expect(() =>
      getWebAuthnValidator({
        pubKey,
        authenticatorId: credentials.authenticatorId,
      }),
    ).toThrow('Only uncompressed public keys are supported')
  })

  it('should return encoded signature from webauthn data', async () => {
    const webauthn = {
      authenticatorData: toHex('authenticatorData'),
      clientDataJSON: 'clientDataHash',
      typeIndex: 0,
    }
    const signature = {
      r: 10n,
      s: 5n,
    }
    const validatorSignature = getWebauthnValidatorSignature({
      webauthn,
      signature,
      usePrecompiled: true,
    })

    expect(validatorSignature).toBeTruthy()
  })
})
