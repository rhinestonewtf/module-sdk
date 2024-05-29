import { Account, Execution, isModuleInstalled } from 'src/account'
import { getModule } from 'src/module'
import {
  getAddOwnerExecution,
  getOwners,
  getRemoveOwnerExecution,
  OWNABLE_EXECUTER_ADDRESS,
} from 'src/module/ownable-executer'
import { Address, getAddress, Hex, PublicClient, TestClient } from 'viem'
import { getInstallModuleData, sendUserOp } from '../infra'
import {
  getExecuteBatchOnOwnedAccountExecution,
  getExecuteOnOwnedAccountExecution,
} from 'src/module/ownable-executer/usage'

type Params = {
  account: Account
  publicClient: PublicClient
  testClient: TestClient
}

export const testOwnableExecutor = async ({
  account,
  publicClient,
}: Params) => {
  it('should return true when checking ownable executer isInstalled', async () => {
    const isOwnableValidatorInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'executor',
        module: OWNABLE_EXECUTER_ADDRESS,
      }),
    })

    expect(isOwnableValidatorInstalled).toBe(true)
  }, 20000)

  it('should return correct module owners', async () => {
    const { ownableExecuter } = getInstallModuleData({ account })

    const owners = await getOwners({ account, client: publicClient })

    expect(getAddress(owners[0])).toEqual(getAddress(ownableExecuter.owner))
  }, 20000)

  it('should add new owner to ownable executer', async () => {
    const newOwner = '0x206f270A1eBB6Dd3Bc97581376168014FD6eE57c' as Address

    const oldOwners = await getOwners({ account, client: publicClient })
    const addNewOwnerAction = getAddOwnerExecution({ owner: newOwner })

    await sendUserOp({ account, actions: [addNewOwnerAction] })

    const newOwners = await getOwners({ account, client: publicClient })
    expect(newOwners.length).toEqual(oldOwners.length + 1)
  }, 20000)

  it('should remove owner from ownable executor', async () => {
    const ownerToRemove =
      '0x206f270A1eBB6Dd3Bc97581376168014FD6eE57c' as Address

    const oldOwners = await getOwners({ account, client: publicClient })
    const removeOwnerAction = await getRemoveOwnerExecution({
      account,
      client: publicClient,
      owner: ownerToRemove,
    })

    await sendUserOp({ account, actions: [removeOwnerAction as Execution] })

    const newOwners = await getOwners({ account, client: publicClient })
    expect(newOwners.length).toEqual(oldOwners.length - 1)
  }, 20000)

  it('should execute on owned account', async () => {
    const executeOnOwnedAccount = getExecuteOnOwnedAccountExecution({
      ownedAccount: account.address,
      execution: {
        target: '0x206f270A1eBB6Dd3Bc97581376168014FD6eE57c',
        value: BigInt(0),
        callData: '0x',
      },
    })

    const receipt = await sendUserOp({
      account,
      actions: [executeOnOwnedAccount],
    })

    expect(receipt.success).toEqual(true)
  }, 20000)

  it('should batch execute on owned account', async () => {
    const execution = {
      target: '0x206f270A1eBB6Dd3Bc97581376168014FD6eE57c' as Address,
      value: BigInt(0),
      callData: '0x' as Hex,
    }

    const executeOnOwnedAccount = getExecuteBatchOnOwnedAccountExecution({
      ownedAccount: account.address,
      executions: [execution, execution],
    })

    const receipt = await sendUserOp({
      account,
      actions: [executeOnOwnedAccount],
    })

    expect(receipt.success).toEqual(true)
  }, 20000)
}
