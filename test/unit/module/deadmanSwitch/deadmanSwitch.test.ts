import { getDeadmanSwitchConfig, GLOBAL_CONSTANTS } from 'src'
import { Address, zeroAddress } from 'viem'
import { getDeadmanSwitch } from 'src'
import { getClient } from 'src'
import { MockClient } from 'test/utils/mocks/client'
import { getAccount } from 'src'
import { MockAccountDeployed } from 'test/utils/mocks/account'

describe('Deadman switch Module', () => {
  // Setup
  const nominee = '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3' as Address
  const client = getClient(MockClient)
  const account = getAccount(MockAccountDeployed)

  it('should get install deadman switch hook module', async () => {
    const installDeadmanSwitchHookModule = await getDeadmanSwitch({
      nominee,
      timeout: 3,
      moduleType: 'hook',
      account,
      client,
    })

    expect(installDeadmanSwitchHookModule.module).toEqual(
      GLOBAL_CONSTANTS.DEADMAN_SWITCH_ADDRESS,
    )
    expect(installDeadmanSwitchHookModule.initData).toBeDefined()
    expect(installDeadmanSwitchHookModule.type).toEqual('hook')
  })

  it('should get install deadman switch validator module', async () => {
    const installDeadmanSwitchValidatorModule = await getDeadmanSwitch({
      nominee,
      timeout: 3,
      moduleType: 'validator',
      account,
      client,
    })

    expect(installDeadmanSwitchValidatorModule.module).toEqual(
      GLOBAL_CONSTANTS.DEADMAN_SWITCH_ADDRESS,
    )
    expect(installDeadmanSwitchValidatorModule.initData).toBeDefined()
    expect(installDeadmanSwitchValidatorModule.type).toEqual('validator')
  })

  it('should get config data for deadman switch module', async () => {
    const [lastAccess, timeout, nominee] = await getDeadmanSwitchConfig({
      account,
      client,
    })

    expect(lastAccess).toEqual(0)
    expect(timeout).toEqual(0)
    expect(nominee).toEqual(zeroAddress)
  })
})
