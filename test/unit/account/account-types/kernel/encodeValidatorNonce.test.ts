import { getAccount } from 'src'
import { encodeValidatorNonce } from 'src/account/kernel/api/encodeValidatorNonce'
import { MockKernelAccountDeployed } from 'test/utils/mocks/account'
import { MockValidator } from 'test/utils/mocks/module'

// Kernel's nonce key layout is [1 byte vMode | 1 byte vType | 20 bytes vId | 2 byte nonceKey | 8 byte nonce].
// ValidatorLib.decodeNonce (Kernel v3.1) reads byte 1 as vType and, when it equals
// VALIDATION_TYPE_ROOT (0x00), throws away the packed 20-byte identifier and substitutes
// vs.rootValidator instead - verified directly against Kernel v3.1's real source
// (Kernel.sol#validateUserOp: `if (vType == VALIDATION_TYPE_ROOT) { vId = vs.rootValidator; }`)
// and empirically via an anvil-deployed harness replicating ValidatorLib.decodeNonce.
// VALIDATION_TYPE_VALIDATOR is 0x01 - the only value that makes Kernel honor the packed
// validator address instead of silently falling back to the root validator.
describe('Encode Kernel validator nonce', () => {
  it('encodes the validation-type byte (nonce byte 1) as VALIDATION_TYPE_VALIDATOR (0x01), never VALIDATION_TYPE_ROOT (0x00)', () => {
    const nonce = encodeValidatorNonce({ validator: MockValidator })
    const hex = nonce.toString(16).padStart(48, '0')
    const vTypeByte = hex.slice(2, 4)
    expect(vTypeByte).toEqual('01')
  })

  it('packs the validator address into bytes [2:22) of the nonce, immediately after the mode and type bytes', () => {
    const nonce = encodeValidatorNonce({ validator: MockValidator })
    const hex = nonce.toString(16).padStart(48, '0')
    const packedAddress = hex.slice(4, 44)
    expect(`0x${packedAddress}`).toEqual(MockValidator.address.toLowerCase())
  })

  it('accepts a bare address as well as a KernelModule', () => {
    const nonce = encodeValidatorNonce({ validator: MockValidator.address })
    const hex = nonce.toString(16).padStart(48, '0')
    expect(hex.slice(2, 4)).toEqual('01')
    expect(`0x${hex.slice(4, 44)}`).toEqual(MockValidator.address.toLowerCase())
  })
})
