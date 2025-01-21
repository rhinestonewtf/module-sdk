import { getOwnableExecutor } from 'src/module'
import { Address } from 'viem'
import {
  getAddOwnableExecutorOwnerAction,
  getOwnableExecutorOwners,
  getRemoveOwnableExecutorOwnerAction,
  getExecuteOnOwnedAccountAction,
  getExecuteBatchOnOwnedAccountAction,
} from 'src'
import { getClient } from 'src'
import { MockClient } from 'test/utils/mocks/client'
import { getAccount } from 'src'
import { MockAccountDeployed } from 'test/utils/mocks/account'
import { GLOBAL_CONSTANTS } from 'src/constants'

describe('Ownable Executor Module', () => {
  // Setup
  const client = getClient(MockClient)
  const account = getAccount(MockAccountDeployed)

  const owners = [
    '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3',
    '0x9FF36a253C70b65122B47c70F2AfaF65F2957118',
  ] as Address[]

  it('should get install ownable executor module', async () => {
    const installOwnableExecutorModule = getOwnableExecutor({
      owner: owners[0],
    })

    expect(installOwnableExecutorModule.module).toEqual(
      GLOBAL_CONSTANTS.OWNABLE_EXECUTOR_ADDRESS,
    )
    expect(installOwnableExecutorModule.initData).toBeDefined()
    expect(installOwnableExecutorModule.type).toEqual('executor')
  })

  it('Should get addOwnerExecution action', async () => {
    const addOwnerExecution = await getAddOwnableExecutorOwnerAction({
      client,
      account,
      owner: owners[0],
    })

    expect(addOwnerExecution.target).toEqual(
      GLOBAL_CONSTANTS.OWNABLE_EXECUTOR_ADDRESS,
    )
    expect(addOwnerExecution.value).toEqual(BigInt(0))
    expect(addOwnerExecution.callData).toBeDefined()
  })

  it('Should throw error when owner not exists while removing owner', async () => {
    async function getAction() {
      await getRemoveOwnableExecutorOwnerAction({
        account,
        client,
        owner: owners[1],
      })
    }

    await expect(getAction).rejects.toThrow('Owner not found')
  })

  it('Should get list of owners', async () => {
    const allOwners = await getOwnableExecutorOwners({
      account,
      client,
    })
    expect(allOwners.length).toEqual(0)
  })

  it('Should get executeOnOwnedAccountExecution action', async () => {
    const executeOnOwnedAccountExecution = getExecuteOnOwnedAccountAction({
      ownedAccount: owners[1] as Address,
      execution: {
        to: GLOBAL_CONSTANTS.OWNABLE_EXECUTOR_ADDRESS,
        target: GLOBAL_CONSTANTS.OWNABLE_EXECUTOR_ADDRESS,
        value: BigInt(0),
        callData: '0x',
        data: '0x',
      },
    })

    expect(executeOnOwnedAccountExecution.target).toEqual(
      GLOBAL_CONSTANTS.OWNABLE_EXECUTOR_ADDRESS,
    )
    expect(executeOnOwnedAccountExecution.value).toEqual(BigInt(0))
    expect(executeOnOwnedAccountExecution.callData).toBeDefined()
  })

  it('Should get executeBatchOnOwnedAccountExecution action', async () => {
    const executeBatchOnOwnedAccountExecution =
      getExecuteBatchOnOwnedAccountAction({
        ownedAccount: owners[1] as Address,
        executions: [
          {
            to: GLOBAL_CONSTANTS.OWNABLE_EXECUTOR_ADDRESS,
            target: GLOBAL_CONSTANTS.OWNABLE_EXECUTOR_ADDRESS,
            value: BigInt(0),
            callData: '0x',
            data: '0x',
          },
        ],
      })

    expect(executeBatchOnOwnedAccountExecution.target).toEqual(
      GLOBAL_CONSTANTS.OWNABLE_EXECUTOR_ADDRESS,
    )
    expect(executeBatchOnOwnedAccountExecution.value).toEqual(BigInt(0))
    expect(executeBatchOnOwnedAccountExecution.callData).toBeDefined()
  })
})
