import {
  DEADMAN_SWITCH_ADDRESS,
  getConfig,
} from '../../../../src/module/deadman-switch'
import { Address, zeroAddress } from 'viem'
import { getInstallDeadmanSwitch } from '../../../../src/module/deadman-switch'
import { getClient } from '../../../../src/common/getClient'
import { MockClient } from '../../../utils/mocks/client'
import { getAccount } from '../../../../src/account'
import { MockAccountDeployed } from '../../../utils/mocks/account'

describe('Deadman switch Module', () => {
  // Setup
  const nominee = '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3' as Address
  const client = getClient(MockClient)
  const account = getAccount(MockAccountDeployed)

  it('should get install deadman switch hook module', async () => {
    const installDeadmanSwitchHookModule = getInstallDeadmanSwitch({
      nominee,
      timeout: 3,
      moduleType: 'hook',
    })

    expect(installDeadmanSwitchHookModule.module).toEqual(
      DEADMAN_SWITCH_ADDRESS,
    )
    expect(installDeadmanSwitchHookModule.data).toBeDefined()
    expect(installDeadmanSwitchHookModule.type).toEqual('hook')
  })

  it('should get install deadman switch validator module', async () => {
    const installDeadmanSwitchValidatorModule = getInstallDeadmanSwitch({
      nominee,
      timeout: 3,
      moduleType: 'validator',
    })

    expect(installDeadmanSwitchValidatorModule.module).toEqual(
      DEADMAN_SWITCH_ADDRESS,
    )
    expect(installDeadmanSwitchValidatorModule.data).toBeDefined()
    expect(installDeadmanSwitchValidatorModule.type).toEqual('validator')
  })

  it('should get config data for deadman switch module', async () => {
    const [lastAccess, timeout, nominee] = await getConfig({
      account,
      client,
    })

    expect(lastAccess).toEqual(0)
    expect(timeout).toEqual(0)
    expect(nominee).toEqual(zeroAddress)
  })
})
