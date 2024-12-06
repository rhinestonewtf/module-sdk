import { Account, Execution, isModuleInstalled } from 'src/account'
import { getModule, OWNABLE_VALIDATOR_ADDRESS } from 'src/module'
import {
  Address,
  concat,
  encodePacked,
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
  getOwnableValidatorThreshold,
  getSetOwnableValidatorThresholdAction,
  getOwnableValidatorSignature,
} from 'src/module/ownable-validator/usage'
import { sendUserOp } from '../infra'
import {
  ENTRYPOINT_ADDRESS_V07,
  getUserOperationHash,
  signUserOperationHashWithECDSA,
} from 'permissionless'
import { anvil } from 'viem/chains'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
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

    const ownersSorted = owners.sort()
    const expectedOwnersSorted = ownableValidator.owners.sort()

    expect(owners.length).toEqual(ownableValidator.owners.length)
    for (let i = 0; i < owners.length; i++) {
      expect(getAddress(ownersSorted[i])).toEqual(
        getAddress(expectedOwnersSorted[i]),
      )
    }
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
    const ownerToRemove = privateKeyToAccount(
      '0xf8e4de715b5cddc791e98d9110abe9e05117fbe5004e2241374ea654e7bf15fe' as Hex,
    ).address

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

  it('should re-add a previous owner to ownable validator', async () => {
    const newOwner = privateKeyToAccount(
      '0xf8e4de715b5cddc791e98d9110abe9e05117fbe5004e2241374ea654e7bf15fe' as Hex,
    ).address

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

        return getOwnableValidatorSignature({
          signatures: [signature],
        })
      },
      getDummySignature: async () => {
        return getOwnableValidatorMockSignature({ threshold: 1 })
      },
    })

    expect(receipt).toBeDefined()
  }, 20000)
  it('should validate userOp using ownable validator and three owners', async () => {
    // add new owner
    const thirdOwner = privateKeyToAccount(generatePrivateKey())

    const oldOwners = await getOwnableValidatorOwners({
      account,
      client: publicClient,
    })
    const addNewOwnerAction = (await getAddOwnableValidatorOwnerAction({
      owner: thirdOwner.address,
      account,
      client: publicClient,
    })) as Execution

    await sendUserOp({ account, actions: [addNewOwnerAction] })

    const newOwners = await getOwnableValidatorOwners({
      account,
      client: publicClient,
    })
    expect(newOwners.length).toEqual(oldOwners.length + 1)

    // increase threshold
    const threshold = 3
    const setThresholdAction = getSetOwnableValidatorThresholdAction({
      threshold,
    }) as Execution

    await sendUserOp({ account, actions: [setThresholdAction] })

    const newThreshold = await getOwnableValidatorThreshold({
      account,
      client: publicClient,
    })
    expect(newThreshold).toEqual(threshold)

    // create userOp
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
        const signer1 = privateKeyToAccount(process.env.PRIVATE_KEY as Hex)
        const signer2 = privateKeyToAccount(
          '0xf8e4de715b5cddc791e98d9110abe9e05117fbe5004e2241374ea654e7bf15fe' as Hex,
        )

        const signature1 = await signer1.signMessage({
          message: { raw: userOpHash },
        })

        const signature2 = await signer2.signMessage({
          message: { raw: userOpHash },
        })

        const signature3 = await thirdOwner.signMessage({
          message: { raw: userOpHash },
        })

        return getOwnableValidatorSignature({
          signatures: [signature1, signature2, signature3],
        })
      },
      getDummySignature: async () => {
        return getOwnableValidatorMockSignature({ threshold })
      },
    })

    expect(receipt).toBeDefined()
  }, 20000)
  it('should lower threshold to 1', async () => {
    const threshold = 1
    const setThresholdAction = getSetOwnableValidatorThresholdAction({
      threshold,
    }) as Execution

    await sendUserOp({ account, actions: [setThresholdAction] })

    const newThreshold = await getOwnableValidatorThreshold({
      account,
      client: publicClient,
    })
    expect(newThreshold).toEqual(threshold)
  }, 20000)
}
