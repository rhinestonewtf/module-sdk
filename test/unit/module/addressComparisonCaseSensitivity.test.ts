import { Address, getAddress, PublicClient } from 'viem'
import {
  getAddOwnableValidatorOwnerAction,
  getRemoveOwnableValidatorOwnerAction,
} from 'src/module/ownable-validator/usage'
import { getFlashloanRemoveAddressAction } from 'src/module/cold-storage/usage'
import {
  getAddOwnableExecutorOwnerAction,
  getRemoveOwnableExecutorOwnerAction,
} from 'src/module/ownable-executor/usage'
import { getRemoveSocialRecoveryGuardianAction } from 'src/module/social-recovery/usage'
import { getDeleteAutoSavingConfigAction } from 'src/module/auto-savings/usage'
import { getAccount } from 'src'
import { MockAccountDeployed } from 'test/utils/mocks/account'

// Real EIP-55 checksummed addresses. viem's `readContract` always checksums
// `address`/`address[]` ABI outputs; a caller-supplied address in any other
// case (lowercase, as most callers naturally use) must still be recognized
// as the same address. `===`/`!==` on the raw strings breaks that; only a
// checksum-aware comparison (isAddressEqual) is correct.
const CHECKSUMMED_A = getAddress(
  '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
) as Address
const CHECKSUMMED_B = getAddress(
  '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
) as Address
const LOWERCASE_A = CHECKSUMMED_A.toLowerCase() as Address

const account = getAccount(MockAccountDeployed)

function stubClient(returnValue: unknown): PublicClient {
  return {
    readContract: async () => returnValue,
  } as unknown as PublicClient
}

describe('address comparisons stay case-insensitive across findIndex-based action builders', () => {
  it('ownable-validator: add-owner action detects an already-present owner even when the caller passes a different case', async () => {
    const client = stubClient([CHECKSUMMED_A, CHECKSUMMED_B])

    await expect(
      getAddOwnableValidatorOwnerAction({
        owner: LOWERCASE_A,
        client,
        account,
      }),
    ).rejects.toThrow('Owner already exists')
  })

  it('ownable-validator: remove-owner action finds an owner even when the caller passes a different case', async () => {
    const client = stubClient([CHECKSUMMED_A, CHECKSUMMED_B])

    await expect(
      getRemoveOwnableValidatorOwnerAction({
        owner: LOWERCASE_A,
        client,
        account,
      }),
    ).resolves.toBeDefined()
  })

  it('cold-storage: remove-whitelist action finds an address even when the caller passes a different case', async () => {
    const client = stubClient([CHECKSUMMED_A, CHECKSUMMED_B])

    await expect(
      getFlashloanRemoveAddressAction({
        addressToRemove: LOWERCASE_A,
        client,
        account,
      }),
    ).resolves.toBeDefined()
  })

  it('ownable-executor: add-owner action detects an already-present owner even when the caller passes a different case', async () => {
    const client = stubClient([CHECKSUMMED_A, CHECKSUMMED_B])

    await expect(
      getAddOwnableExecutorOwnerAction({
        owner: LOWERCASE_A,
        client,
        account,
      }),
    ).rejects.toThrow('Owner already exists')
  })

  it('ownable-executor: remove-owner action finds an owner even when the caller passes a different case', async () => {
    const client = stubClient([CHECKSUMMED_A, CHECKSUMMED_B])

    await expect(
      getRemoveOwnableExecutorOwnerAction({
        owner: LOWERCASE_A,
        client,
        account,
      }),
    ).resolves.toBeDefined()
  })

  it('social-recovery: remove-guardian action finds a guardian even when the caller passes a different case', async () => {
    const client = stubClient([CHECKSUMMED_A, CHECKSUMMED_B])

    await expect(
      getRemoveSocialRecoveryGuardianAction({
        guardian: LOWERCASE_A,
        client,
        account,
      }),
    ).resolves.toBeDefined()
  })

  it('auto-savings: remove-token action finds a token even when the caller passes a different case', async () => {
    const client = stubClient([CHECKSUMMED_A, CHECKSUMMED_B])

    await expect(
      getDeleteAutoSavingConfigAction({
        token: LOWERCASE_A,
        client,
        account,
      }),
    ).resolves.toBeDefined()
  })
})
