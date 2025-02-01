import { getOwnableValidator } from 'src/module'
import { Address } from 'viem'
import {
  getAddOwnableValidatorOwnerAction,
  getOwnableValidatorOwners,
  getRemoveOwnableValidatorOwnerAction,
  getSetOwnableValidatorThresholdAction,
} from 'src'
import { getClient } from 'src'
import { MockClient } from 'test/utils/mocks/client'
import { getAccount } from 'src'
import { MockAccountDeployed } from 'test/utils/mocks/account'
import { getOwnableValidatorThreshold } from 'src/module'
import { Execution } from 'src/account'
import { GLOBAL_CONSTANTS } from 'src'

describe('Ownable Validator Module', () => {
  // Setup
  const client = getClient(MockClient)
  const account = getAccount(MockAccountDeployed)

  const owners = [
    '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3',
    '0x9FF36a253C70b65122B47c70F2AfaF65F2957118',
  ] as Address[]

  it('should get install ownable validator module', async () => {
    const installOwnableValidatorModule = getOwnableValidator({
      threshold: 3,
      owners,
    })

    expect(installOwnableValidatorModule.module).toEqual(
      GLOBAL_CONSTANTS.OWNABLE_VALIDATOR_ADDRESS,
    )
    expect(installOwnableValidatorModule.initData).toBeDefined()
    expect(installOwnableValidatorModule.type).toEqual('validator')
  })

  it('Should get setThresholdExecution action', async () => {
    const setThresholdExecution = getSetOwnableValidatorThresholdAction({
      threshold: 3,
    })

    expect(setThresholdExecution.target).toEqual(
      GLOBAL_CONSTANTS.OWNABLE_VALIDATOR_ADDRESS,
    )
    expect(setThresholdExecution.value).toEqual(BigInt(0))
    expect(setThresholdExecution.callData).toBeDefined()
  })

  it('Should get addOwnerExecution action', async () => {
    const addOwnerExecution = (await getAddOwnableValidatorOwnerAction({
      client,
      account,
      owner: owners[0],
    })) as Execution

    expect(addOwnerExecution.target).toEqual(
      GLOBAL_CONSTANTS.OWNABLE_VALIDATOR_ADDRESS,
    )
    expect(addOwnerExecution.value).toEqual(BigInt(0))
    expect(addOwnerExecution.callData).toBeDefined()
  })

  it('Should throw error when owner does not exists while removing owner', async () => {
    async function getAction() {
      await getRemoveOwnableValidatorOwnerAction({
        account,
        client,
        owner: owners[1],
      })
    }

    await expect(getAction).rejects.toThrow('Owner not found')
  })

  it('Should get list of owners', async () => {
    const allOwners = await getOwnableValidatorOwners({
      account,
      client,
    })
    expect(allOwners.length).toEqual(1)
  })

  it('should return ownable validator threshold', async () => {
    const threshold = await getOwnableValidatorThreshold({
      client,
      account,
    })

    expect(threshold).toEqual(1)
  })
})
