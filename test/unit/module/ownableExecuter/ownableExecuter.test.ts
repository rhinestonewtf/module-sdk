import { getInstallOwnableExecuter } from '../../../../src/module/ownable-executer/installation'
import { OWNABLE_EXECUTER_ADDRESS } from '../../../../src/module/ownable-executer/constants'
import { Address } from 'viem'
import {
  getAddOwnerExecution,
  getOwners,
  getRemoveOwnerExecution,
  getExecuteOnOwnedAccountExecution,
  getExecuteBatchOnOwnedAccountExecution,
} from '../../../../src/module/ownable-executer/usage'
import { getClient } from '../../../../src/common/getClient'
import { MockClient } from '../../../utils/mocks/client'
import { getAccount } from '../../../../src/account'
import { MockAccountDeployed } from '../../../utils/mocks/account'

describe('Ownable Executer Module', () => {
  // Setup
  const client = getClient(MockClient)
  const account = getAccount(MockAccountDeployed)

  const owners = [
    '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3',
    '0x9FF36a253C70b65122B47c70F2AfaF65F2957118',
  ] as Address[]

  it('should get install ownable executer module', async () => {
    const installOwnableExecuterModule = getInstallOwnableExecuter({
      owner: owners[0],
    })

    expect(installOwnableExecuterModule.module).toEqual(
      OWNABLE_EXECUTER_ADDRESS,
    )
    expect(installOwnableExecuterModule.data).toBeDefined()
    expect(installOwnableExecuterModule.type).toEqual('executor')
  })

  it('Should get addOwnerExecution action', async () => {
    const addOwnerExecution = getAddOwnerExecution({
      owner: owners[0],
    })

    expect(addOwnerExecution.target).toEqual(OWNABLE_EXECUTER_ADDRESS)
    expect(addOwnerExecution.value).toEqual(BigInt(0))
    expect(addOwnerExecution.callData).toBeDefined()
  })

  it('Should throw error when owner not exists while removing owner', async () => {
    const removeOwnerExecution = await getRemoveOwnerExecution({
      account,
      client,
      owner: owners[1],
    })

    expect((removeOwnerExecution as Error).message).toEqual('Owner not found')
  })

  it('Should get list of owners', async () => {
    const allOwners = await getOwners({
      account,
      client,
    })
    expect(allOwners.length).toEqual(0)
  })

  it('Should get executeOnOwnedAccountExecution action', async () => {
    const executeOnOwnedAccountExecution = getExecuteOnOwnedAccountExecution({
      ownedAccount: owners[1] as Address,
      execution: {
        target: OWNABLE_EXECUTER_ADDRESS,
        value: BigInt(0),
        callData: '0x',
      },
    })

    expect(executeOnOwnedAccountExecution.target).toEqual(
      OWNABLE_EXECUTER_ADDRESS,
    )
    expect(executeOnOwnedAccountExecution.value).toEqual(BigInt(0))
    expect(executeOnOwnedAccountExecution.callData).toBeDefined()
  })

  it('Should get executeBatchOnOwnedAccountExecution action', async () => {
    const executeBatchOnOwnedAccountExecution =
      getExecuteBatchOnOwnedAccountExecution({
        ownedAccount: owners[1] as Address,
        executions: [
          {
            target: OWNABLE_EXECUTER_ADDRESS,
            value: BigInt(0),
            callData: '0x',
          },
        ],
      })

    expect(executeBatchOnOwnedAccountExecution.target).toEqual(
      OWNABLE_EXECUTER_ADDRESS,
    )
    expect(executeBatchOnOwnedAccountExecution.value).toEqual(BigInt(0))
    expect(executeBatchOnOwnedAccountExecution.callData).toBeDefined()
  })
})
