import { Account, Execution, isModuleInstalled } from 'src/account'
import { getModule, OWNABLE_VALIDATOR_ADDRESS } from 'src/module'
import {
  Address,
  getAddress,
  Hex,
  PublicClient,
  TestClient,
  zeroAddress,
} from 'viem'
import { getInstallModuleData } from '../infra/installModuleActions'
import {
  getOwnableValidatorOwners,
  getAddOwnableValidatorOwnerAction,
  getRemoveOwnableValidatorOwnerAction,
  getIsValidSignatureStateless,
  encodeValidationData,
} from 'src/module/ownable-validator/usage'
import { sendUserOp } from '../infra'
import {
  ENTRYPOINT_ADDRESS_V07,
  getUserOperationHash,
  signUserOperationHashWithECDSA,
} from 'permissionless'
import { anvil } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { getOwnableValidatorMockSignature } from 'src/module'

type Params = {
  account: Account
  publicClient: PublicClient
  testClient: TestClient
}

export const testOwnableValidator = async ({
  account,
  publicClient,
}: Params) => {
  it('should return true when checking ownable validator isInstalled', async () => {
    const isOwnableValidatorInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'validator',
        module: OWNABLE_VALIDATOR_ADDRESS,
      }),
    })

    expect(isOwnableValidatorInstalled).toBe(true)
  }, 20000)

  it('should return correct module owners', async () => {
    const { ownableValidator } = getInstallModuleData({ account })

    const owners = await getOwnableValidatorOwners({
      account,
      client: publicClient,
    })

    expect(owners.length).toEqual(ownableValidator.owners.length)
    expect(getAddress(owners[0])).toEqual(
      getAddress(ownableValidator.owners[0]),
    )
  }, 20000)

  it('should add new owner to ownable validator', async () => {
    const newOwner = '0x6FcFDf060D3c32326c47c9B3bc4bDE4adF5b203e' as Address

    const oldOwners = await getOwnableValidatorOwners({
      account,
      client: publicClient,
    })
    const addNewOwnerAction = (await getAddOwnableValidatorOwnerAction({
      owner: newOwner,
      account,
      client: publicClient,
    })) as Execution

    await sendUserOp({ account, actions: [addNewOwnerAction] })

    const newOwners = await getOwnableValidatorOwners({
      account,
      client: publicClient,
    })
    expect(newOwners.length).toEqual(oldOwners.length + 1)
  }, 20000)

  it('should remove owner from ownable validator', async () => {
    const ownerToRemove =
      '0x206f270A1eBB6Dd3Bc97581376168014FD6eE57c' as Address

    const oldOwners = await getOwnableValidatorOwners({
      account,
      client: publicClient,
    })
    const removeOwnerAction = await getRemoveOwnableValidatorOwnerAction({
      account,
      client: publicClient,
      owner: ownerToRemove,
    })

    await sendUserOp({ account, actions: [removeOwnerAction as Execution] })

    const newOwners = await getOwnableValidatorOwners({
      account,
      client: publicClient,
    })
    expect(newOwners.length).toEqual(oldOwners.length - 1)
  }, 20000)

  it('should return true when checking stateless validation', async () => {
    const account = privateKeyToAccount(process.env.PRIVATE_KEY as Hex)

    const hash = getUserOperationHash({
      userOperation: {
        callData: '0x',
        nonce: BigInt(0),
        sender: account.address,
        callGasLimit: BigInt(0),
        maxFeePerGas: BigInt(0),
        maxPriorityFeePerGas: BigInt(0),
        preVerificationGas: BigInt(0),
        verificationGasLimit: BigInt(0),
        signature: '0x',
      },
      chainId: anvil.id,
      entryPoint: ENTRYPOINT_ADDRESS_V07,
    })

    const signature = await signUserOperationHashWithECDSA({
      account,
      hash,
    })
    const isValidSignature = await getIsValidSignatureStateless({
      hash,
      signature,
      data: encodeValidationData({ threshold: 1, owners: [account.address] }),
      client: publicClient,
    })

    expect(isValidSignature).toBe(true)
  }, 20000)

  it('should validate userOp using ownable validator', async () => {
    const receipt = await sendUserOp({
      account,
      actions: [
        {
          target: zeroAddress,
          value: BigInt(100),
          callData: '0x',
        },
      ],
      validator: OWNABLE_VALIDATOR_ADDRESS,
      signUserOpHash: async (userOpHash) => {
        const signer = privateKeyToAccount(process.env.PRIVATE_KEY as Hex)

        const signature = await signer.signMessage({
          message: { raw: userOpHash },
        })

        return signature
      },
      getDummySignature: async () => {
        return getOwnableValidatorMockSignature()
      },
    })

    expect(receipt).toBeDefined()
  }, 20000)
}
