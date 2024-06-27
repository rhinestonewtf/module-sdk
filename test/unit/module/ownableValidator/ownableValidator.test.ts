import { getInstallOwnableValidator } from 'src/module/ownable-validator/installation'
import { OWNABLE_VALIDATOR_ADDRESS } from 'src/module/ownable-validator/constants'
import { Address } from 'viem'
import {
  getAddOwnableValidatorOwnerAction,
  getOwnableValidatorOwners,
  getRemoveOwnableValidatorOwnerAction,
  getSetOwnableValidatorThresholdAction,
} from 'src/module/ownable-validator/usage'
import { getClient } from 'src/common/getClient'
import { MockClient } from 'test/utils/mocks/client'
import { getAccount } from 'src/account'
import { MockAccountDeployed } from 'test/utils/mocks/account'

describe('Ownable Validator Module', () => {
  // Setup
  const client = getClient(MockClient)
  const account = getAccount(MockAccountDeployed)

  const owners = [
    '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3',
    '0x9FF36a253C70b65122B47c70F2AfaF65F2957118',
  ] as Address[]

  it('should get install ownable validator module', async () => {
    const installOwnableValidatorModule = getInstallOwnableValidator({
      threshold: 3,
      owners,
    })

    expect(installOwnableValidatorModule.module).toEqual(
      OWNABLE_VALIDATOR_ADDRESS,
    )
    expect(installOwnableValidatorModule.data).toBeDefined()
    expect(installOwnableValidatorModule.type).toEqual('validator')
  })

  it('Should get setThresholdExecution action', async () => {
    const setThresholdExecution = getSetOwnableValidatorThresholdAction({
      threshold: 3,
    })

    expect(setThresholdExecution.target).toEqual(OWNABLE_VALIDATOR_ADDRESS)
    expect(setThresholdExecution.value).toEqual(BigInt(0))
    expect(setThresholdExecution.callData).toBeDefined()
  })

  it('Should get addOwnerExecution action', async () => {
    const addOwnerExecution = getAddOwnableValidatorOwnerAction({
      owner: owners[0],
    })

    expect(addOwnerExecution.target).toEqual(OWNABLE_VALIDATOR_ADDRESS)
    expect(addOwnerExecution.value).toEqual(BigInt(0))
    expect(addOwnerExecution.callData).toBeDefined()
  })

  it('Should throw error when owner not exists while removing owner', async () => {
    const removeOwnerExecution = await getRemoveOwnableValidatorOwnerAction({
      account,
      client,
      owner: owners[1],
    })

    expect((removeOwnerExecution as Error).message).toEqual('Owner not found')
  })

  it('Should get list of owners', async () => {
    const allOwners = await getOwnableValidatorOwners({
      account,
      client,
    })
    expect(allOwners.length).toEqual(0)
  })
})
