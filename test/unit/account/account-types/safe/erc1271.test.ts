import { getAccount, installModule } from 'src'
import { getModule } from 'src'
import { getClient } from 'src'
import { encode1271Hash, encode1271Signature } from 'src/account'
import { MockSafeAccountDeployed } from 'test/utils/mocks/account'
import { MockClient } from 'test/utils/mocks/client'
import { MockValidator } from 'test/utils/mocks/module'
import { Hex, keccak256, parseAbi, toHex } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

describe('test ERC-1271 on the account', () => {
  // Setup
  const client = getClient(MockClient)
  const account = getAccount(MockSafeAccountDeployed)
  const validator = getModule(MockValidator)

  it('should validate an ERC-1271 signature with a validator', async () => {
    const hash = keccak256(toHex('hash'))
    const formattedHash = encode1271Hash({
      account,
      chainId: sepolia.id,
      validator: validator.module,
      hash,
    })

    const signer = privateKeyToAccount(
      '0xa88f4055e4ffb55fd532c07c65aa45ba1d969c07f749e14f6b79bfb434688efb' as Hex,
    )
    const rawSignature = await signer.signMessage({
      message: { raw: formattedHash },
    })

    const signature = encode1271Signature({
      account,
      signature: rawSignature,
      validator: validator.module,
    })

    const returnValue = await client.readContract({
      address: account.address,
      abi: parseAbi([
        'function isValidSignature(bytes32 hash, bytes memory signature) public view returns (bytes4)',
      ]),
      functionName: 'isValidSignature',
      args: [hash, signature],
    })
    expect(returnValue).toEqual('0x1626ba7e')
  })

  it('should validate an ERC-1271 signature with the safe native logic', async () => {
    const hash = keccak256(toHex('hash'))
    const formattedHash = encode1271Hash({
      account,
      chainId: sepolia.id,
      validator: account.address,
      hash,
    })

    const signer = privateKeyToAccount(
      '0xa88f4055e4ffb55fd532c07c65aa45ba1d969c07f749e14f6b79bfb434688efb' as Hex,
    )
    const rawSignature = await signer.signMessage({
      message: { raw: formattedHash },
    })

    const signature = encode1271Signature({
      account,
      signature: rawSignature,
      validator: account.address,
    })

    const returnValue = await client.readContract({
      address: account.address,
      abi: parseAbi([
        'function isValidSignature(bytes32 hash, bytes memory signature) public view returns (bytes4)',
      ]),
      functionName: 'isValidSignature',
      args: [hash, signature],
    })
    expect(returnValue).toEqual('0x1626ba7e')
  })
})
