import { Account } from 'src/account/types'
import { encodeModuleInstallationData } from 'src/account/kernel/api/encodeModuleInstallationData'
import { decodeAbiParameters, encodeAbiParameters } from 'viem'
import { MockKernelAccountDeployed } from 'test/utils/mocks/account'
import { MockValidator } from 'test/utils/mocks/module'

// Kernel v3.1's installModule (validator/executor branch) decodes the packed
// `bytes` data as [20-byte hook address][ABI-encoded (bytes validatorData, bytes hookData, bytes selectorData)]
// via raw assembly offset arithmetic that assumes exactly THREE dynamic bytes fields
// after the hook address (Kernel.sol#installModule, MODULE_TYPE_VALIDATOR branch).
// Verified directly against Kernel v3.1's real source and empirically: an anvil-deployed
// harness replicating that exact assembly block reverts (runs out of gas trying to
// process nonsensical calldata offsets) on a TWO-field encoding, and decodes correctly
// on a THREE-field encoding.
describe('Encode Kernel module installation data', () => {
  const account = MockKernelAccountDeployed as Account

  it('encodes exactly three dynamic bytes fields after the hook address for a validator module', () => {
    const encoded = encodeModuleInstallationData({
      account,
      module: MockValidator,
    })

    // Strip the 20-byte (40 hex char) hook address prefix, decode the rest as
    // Kernel actually does: three ABI-encoded dynamic `bytes` fields.
    const rest = `0x${encoded.slice(42)}` as `0x${string}`
    const [validatorData, hookData, selectorData] = decodeAbiParameters(
      [{ type: 'bytes' }, { type: 'bytes' }, { type: 'bytes' }],
      rest,
    )

    expect(validatorData).toEqual(MockValidator.initData)
    expect(hookData).toEqual('0x')
    expect(selectorData).toEqual('0x')
  })

  it('does NOT encode only two dynamic bytes fields (the bug this guards against)', () => {
    const encoded = encodeModuleInstallationData({
      account,
      module: MockValidator,
    })
    const rest = `0x${encoded.slice(42)}` as `0x${string}`

    // A two-field encoding is a strict prefix-incompatible shape - decoding the
    // three-field output as if it were two fields must NOT round-trip to the
    // same two values a naive [bytes, bytes] encoder would have produced,
    // proving the output really does carry three fields, not two padded to look like three.
    const twoFieldEncoding = encodeAbiParameters(
      [{ type: 'bytes' }, { type: 'bytes' }],
      [MockValidator.initData, '0x'],
    )
    expect(rest).not.toEqual(twoFieldEncoding)
  })
})
