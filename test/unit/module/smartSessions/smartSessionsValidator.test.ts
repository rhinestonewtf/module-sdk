import { toBytes, toHex, zeroAddress } from 'viem'
import { Session } from 'src/module/smart-sessions/types'
import {
  getSmartSessionsValidator,
  SMART_SESSIONS_ADDRESS,
} from 'src/module/smart-sessions'

describe('Smart Sessions Polices', () => {
  it('should get install smart sessions', async () => {
    const sessions: Session[] = [
      {
        sessionValidator: zeroAddress,
        sessionValidatorInitData: '0x',
        salt: toHex(toBytes(1, { size: 32 })),
        userOpPolicies: [],
        actions: [],
        erc7739Policies: {
          allowedERC7739Content: [],
          erc1271Policies: [],
        },
      },
    ]

    const installSmartSession = getSmartSessionsValidator({ sessions })
    expect(installSmartSession.module).toEqual(SMART_SESSIONS_ADDRESS)
    expect(installSmartSession.initData).toBeDefined()
    expect(installSmartSession.deInitData).toEqual('0x')
  })
})
