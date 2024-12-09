import {
  WEBAUTHN_VALIDATOR_ADDRESS,
  getWebAuthnValidator,
  getWebauthnValidatorSignature,
} from 'src/module'
import { toHex, concatHex } from 'viem'

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
    const pubKey = concatHex([
      toHex(credentials.pubKey.x, { size: 32 }),
      toHex(credentials.pubKey.y, { size: 32 })
    ])

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
    const pubKey = concatHex([
      toHex(4, { size: 1 }),
      toHex(credentials.pubKey.x, { size: 32 }),
      toHex(credentials.pubKey.y, { size: 32 })
    ])
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
    const pubKey = concatHex([
      toHex(1, { size: 1 }),
      toHex(credentials.pubKey.x, { size: 32 }),
      toHex(credentials.pubKey.y, { size: 32 })
    ])
    
    expect(() => 
      getWebAuthnValidator({
      pubKey,
      authenticatorId: credentials.authenticatorId,
    })).toThrow('Only uncompressed public keys are supported')
  })

  it('should return encoded signature from webauthn data', async () => {
    const signature = getWebauthnValidatorSignature({
      authenticatorData: toHex('authenticatorData'),
      clientDataJSON: 'clientDataHash',
      responseTypeLocation: BigInt(0),
      r: BigInt(10),
      s: BigInt(5),
      usePrecompiled: true,
    })

    expect(signature).toBeTruthy()
  })
})
