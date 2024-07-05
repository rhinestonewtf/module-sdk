import {
  WEBAUTHN_VALIDATOR_ADDRESS,
  getWebAuthnValidator,
  getWebauthnValidatorSignature,
} from 'src/module'
import { toHex } from 'viem'

describe('Webauthn Validator Module', () => {
  // Setup
  const credentials = {
    pubKeyX: 123,
    pubKeyY: 456,
    authenticatorId: 'authenticatorId',
  }

  it('should get install webauthn validator module', async () => {
    const installWebauthnValidatorModule = getWebAuthnValidator({
      pubKeyX: credentials.pubKeyX,
      pubKeyY: credentials.pubKeyY,
      authenticatorId: credentials.authenticatorId,
    })

    expect(installWebauthnValidatorModule.module).toEqual(
      WEBAUTHN_VALIDATOR_ADDRESS,
    )
    expect(installWebauthnValidatorModule.data).toBeDefined()
    expect(installWebauthnValidatorModule.type).toEqual('validator')
  })

  it('should return encoded signature from webauthn data', async () => {
    const signature = getWebauthnValidatorSignature({
      authenticatorData: toHex('authenticatorData'),
      clientDataJSON: 'clientDataHash',
      responseTypeLocation: 0,
      r: 10,
      s: 5,
      usePrecompiled: true,
    })

    expect(signature).toBeTruthy()
  })
})
