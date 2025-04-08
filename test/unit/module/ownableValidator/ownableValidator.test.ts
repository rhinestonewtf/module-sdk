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
    '0x7F2d5Aa82C34A5F49191A97a6e066a1C24Dbb545',
    '0xbAA4e1194cd1C9E9837eB0e3C01072973295E183',
    '0xBFAFDBABe534180d2ee45463c5C4117CED0033fe',
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

  it('should sort the owners properly', async () => {
    const installOwnableValidatorModule = getOwnableValidator({
      threshold: 3,
      owners,
    })
    expect(installOwnableValidatorModule.initData).toEqual(
      '0x0000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000030000000000000000000000007f2d5aa82c34a5f49191a97a6e066a1c24dbb545000000000000000000000000baa4e1194cd1c9e9837eb0e3c01072973295e183000000000000000000000000bfafdbabe534180d2ee45463c5c4117ced0033fe',
    )
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
