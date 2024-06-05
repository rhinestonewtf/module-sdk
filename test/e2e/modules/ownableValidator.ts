import { Account, Execution, isModuleInstalled } from 'src/account'
import { getModule, OWNABLE_VALIDATOR_ADDRESS } from 'src/module'
import { Address, getAddress, PublicClient, TestClient } from 'viem'
import { getInstallModuleData } from '../infra/installModuleActions'
import {
  getOwners,
  getAddOwnerAction,
  getRemoveOwnerAction,
} from 'src/module/ownable-validator/usage'
import { sendUserOp } from '../infra'

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

    const owners = await getOwners({ account, client: publicClient })

    expect(owners.length).toEqual(ownableValidator.owners.length)
    expect(getAddress(owners[0])).toEqual(
      getAddress(ownableValidator.owners[0]),
    )
  }, 20000)

  it('should add new owner to ownable validator', async () => {
    const newOwner = '0x206f270A1eBB6Dd3Bc97581376168014FD6eE57c' as Address

    const oldOwners = await getOwners({ account, client: publicClient })
    const addNewOwnerAction = getAddOwnerAction({ owner: newOwner })

    await sendUserOp({ account, actions: [addNewOwnerAction] })

    const newOwners = await getOwners({ account, client: publicClient })
    expect(newOwners.length).toEqual(oldOwners.length + 1)
  }, 20000)

  it('should remove owner from ownable validator', async () => {
    const ownerToRemove =
      '0x206f270A1eBB6Dd3Bc97581376168014FD6eE57c' as Address

    const oldOwners = await getOwners({ account, client: publicClient })
    const removeOwnerAction = await getRemoveOwnerAction({
      account,
      client: publicClient,
      owner: ownerToRemove,
    })

    await sendUserOp({ account, actions: [removeOwnerAction as Execution] })

    const newOwners = await getOwners({ account, client: publicClient })
    expect(newOwners.length).toEqual(oldOwners.length - 1)
  }, 20000)
}
