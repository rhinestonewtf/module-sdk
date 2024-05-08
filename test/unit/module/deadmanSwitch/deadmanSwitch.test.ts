import { DEADMAN_SWITCH_ADDRESS } from '../../../../src/module/deadman-switch'
import { Address } from 'viem'
import { getInstallDeadmanSwitch } from '../../../../src/module/deadman-switch'

describe('Deadman switch Module', () => {
  // Setup
  const nominee = '0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3' as Address

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
})
