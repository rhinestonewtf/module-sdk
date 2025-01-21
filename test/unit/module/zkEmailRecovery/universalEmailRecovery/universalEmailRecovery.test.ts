import { getAddress, toFunctionSelector, toHex, zeroAddress } from 'viem'
import { sepolia } from 'viem/chains'
import { getUniversalEmailRecoveryExecutor } from 'src/module/zk-email-recovery/universal-email-recovery/installation'
import {
  acceptanceCommandTemplates,
  canStartRecoveryRequest,
  computeAcceptanceTemplateId,
  computeEmailAuthAddress,
  computeRecoveryTemplateId,
  EmailAuthMsg,
  extractRecoveredAccountFromAcceptanceCommand,
  extractRecoveredAccountFromRecoveryCommand,
  getAddGuardianAction,
  getAllGuardians,
  getAllowedSelectors,
  getAllowedValidators,
  getAllowValidatorRecoveryAction,
  getCancelExpiredRecoveryAction,
  getCancelRecoveryAction,
  getChangeThresholdAction,
  getCompleteRecoveryAction,
  getDisallowValidatorRecoveryAction,
  getDkim,
  getEmailAuthImplementation,
  getGuardian,
  getGuardianConfig,
  getHandleAcceptanceAction,
  getHandleRecoveryAction,
  getPreviousRecoveryRequest,
  getRecoveryConfig,
  getRecoveryRequest,
  getRemoveGuardianAction,
  getUpdateRecoveryConfigAction,
  getVerifier,
  hasGuardianVoted,
  isActivated,
  recoveryCommandTemplates,
} from 'src/module/zk-email-recovery/universal-email-recovery/usage'
import { getClient } from 'src/common/getClient'
import { MockClient } from '../../../../utils/mocks/client'
import { getAccount } from 'src/account'
import { MockAccountDeployed } from '../../../../utils/mocks/account'
import { GLOBAL_CONSTANTS } from 'src/constants'

describe('Universal Email Recovery Module', () => {
  // Setup
  const client = getClient(MockClient)
  const account = getAccount(MockAccountDeployed)

  const validator = GLOBAL_CONSTANTS.OWNABLE_VALIDATOR_ADDRESS
  const isInstalledContext = toHex(0)
  const initialSelector = toFunctionSelector('function addOwner(address)')
  const guardians = [
    getAddress('0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3'),
    getAddress('0x9FF36a253C70b65122B47c70F2AfaF65F2957118'),
  ]
  const weights = [1n, 2n]
  const threshold = 2n
  const delay = 0n // 0 seconds
  const expiry = 2n * 7n * 24n * 60n * 60n // 2 weeks in seconds

  it('should get install universal email recovery module', async () => {
    const installUniversalEmailModule = getUniversalEmailRecoveryExecutor({
      validator,
      isInstalledContext,
      initialSelector,
      guardians,
      weights,
      threshold,
      delay,
      expiry,
      chainId: sepolia.id,
    })

    expect(installUniversalEmailModule.address).toEqual(
      GLOBAL_CONSTANTS.UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    )
    expect(installUniversalEmailModule.module).toEqual(
      GLOBAL_CONSTANTS.UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    )
    expect(installUniversalEmailModule.initData).toBeDefined()
    expect(installUniversalEmailModule.deInitData).toEqual('0x')
    expect(installUniversalEmailModule.additionalContext).toEqual('0x')
    expect(installUniversalEmailModule.type).toEqual('executor')
    expect(installUniversalEmailModule.hook).toBeUndefined()
  })

  it('Should get recovery config', async () => {
    const config = await getRecoveryConfig({
      account,
      client,
    })
    expect(config.delay).toEqual(0n)
    expect(config.expiry).toEqual(0n)
  })

  it('Should get recovery request', async () => {
    const request = await getRecoveryRequest({
      account,
      client,
    })
    expect(request[0]).toEqual(0n)
    expect(request[1]).toEqual(0n)
    expect(request[2]).toEqual(0n)
    expect(request[3]).toEqual(
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    )
  })

  it('Should get previous recovery request', async () => {
    const prevRequest = await getPreviousRecoveryRequest({
      account,
      client,
    })
    expect(prevRequest.previousGuardianInitiated).toEqual(zeroAddress)
    expect(prevRequest.cancelRecoveryCooldown).toEqual(0n)
  })

  it('Should check if activated', async () => {
    const activated = await isActivated({
      account,
      client,
    })
    expect(activated).toEqual(false)
  })

  it('Should check if can start recovery request', async () => {
    const canStart = await canStartRecoveryRequest({
      account,
      client,
      validator,
    })
    expect(canStart).toEqual(false)
  })

  it('Should get allow validator recovery action', async () => {
    const action = await getAllowValidatorRecoveryAction({
      client,
      validator,
      isInstalledContext,
      recoverySelector: initialSelector,
    })
    expect(action.to).toEqual(GLOBAL_CONSTANTS.UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.target).toEqual(
      GLOBAL_CONSTANTS.UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    )
    expect(action.value).toEqual(0n)
    expect(action.callData).toBeDefined()
    expect(action.data).toBeDefined()
  })

  it('Should get disallow validator recovery action', async () => {
    const prevValidator = '0xD990393C670dCcE8b4d8F858FB98c9912dBFAa06'
    const action = await getDisallowValidatorRecoveryAction({
      client,
      validator,
      prevValidator,
      recoverySelector: initialSelector,
    })
    expect(action.to).toEqual(GLOBAL_CONSTANTS.UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.target).toEqual(
      GLOBAL_CONSTANTS.UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    )
    expect(action.value).toEqual(0n)
    expect(action.callData).toBeDefined()
    expect(action.data).toBeDefined()
  })

  it('Should get allowed validators', async () => {
    const validators = await getAllowedValidators({
      account,
      client,
    })
    expect(validators).toEqual([])
  })

  it('Should get allowed selectors', async () => {
    const selectors = await getAllowedSelectors({
      account,
      client,
    })
    expect(selectors).toEqual([])
  })

  it('Should get acceptance command templates', async () => {
    const templates = await acceptanceCommandTemplates({
      client,
    })
    expect(templates).toEqual([
      ['Accept', 'guardian', 'request', 'for', '{ethAddr}'],
    ])
  })

  it('Should get recovery command templates', async () => {
    const templates = await recoveryCommandTemplates({
      client,
    })
    expect(templates).toEqual([
      [
        'Recover',
        'account',
        '{ethAddr}',
        'using',
        'recovery',
        'hash',
        '{string}',
      ],
    ])
  })

  it('Should extract recovered account from acceptance command', async () => {
    const recoveredAccount = await extractRecoveredAccountFromAcceptanceCommand(
      {
        client,
        commandParams: [account.address],
        templateIdx: 0n,
      },
    )
    expect(recoveredAccount).toEqual(zeroAddress)
  })

  it('Should extract recovered account from recovery command', async () => {
    const recoveredAccount = await extractRecoveredAccountFromRecoveryCommand({
      client,
      commandParams: [account.address],
      templateIdx: 0n,
    })
    expect(recoveredAccount).toEqual(zeroAddress)
  })

  it('Should compute acceptance template id', async () => {
    const expectedId =
      78246708611299769969691317804450782728492512111741514614578044794817483451845n
    const id = await computeAcceptanceTemplateId({
      client,
      templateIdx: 0n,
    })
    expect(id).toEqual(expectedId)
  })

  it('Should compute recovery template id', async () => {
    const expectedId =
      41597252099594059824363833791590872545117890762070757419930713588231239964259n
    const id = await computeRecoveryTemplateId({
      client,
      templateIdx: 0n,
    })
    expect(id).toEqual(expectedId)
  })

  it('Should get verifier', async () => {
    const expectedVerifier = getAddress(
      '0x3E5f29a7cCeb30D5FCD90078430CA110c2985716',
    )
    const verifier = await getVerifier({
      client,
    })
    expect(verifier).toEqual(expectedVerifier)
  })

  it('Should get DKIM', async () => {
    const expectedDkim = getAddress(
      '0x3D3935B3C030893f118a84C92C66dF1B9E4169d6',
    )
    const dkim = await getDkim({
      client,
    })
    expect(dkim).toEqual(expectedDkim)
  })

  it('Should get email auth implementation', async () => {
    const expectedEmailAuth = getAddress(
      '0x2721a8eB83Ef105f7B30DAB4e8A4da97cD54f970',
    )
    const emailAuthImplementation = await getEmailAuthImplementation({
      client,
    })
    expect(emailAuthImplementation).toEqual(expectedEmailAuth)
  })

  it('Should get update recovery config action', async () => {
    const action = await getUpdateRecoveryConfigAction({
      client,
      delay,
      expiry,
    })
    expect(action.to).toEqual(GLOBAL_CONSTANTS.UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.target).toEqual(
      GLOBAL_CONSTANTS.UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    )
    expect(action.value).toEqual(0n)
    expect(action.callData).toBeDefined()
    expect(action.data).toBeDefined()
  })

  it('Should get handle acceptance action', async () => {
    const emailAuthMsg: EmailAuthMsg = {
      templateId: 1n,
      commandParams: [
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
      ],
      skippedCommandPrefix: 0n,
      proof: {
        domainName: 'gmail.com',
        publicKeyHash:
          '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
        timestamp: 1709251200n, // 1st March 2024
        maskedCommand: 'recover account',
        emailNullifier:
          '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        accountSalt:
          '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
        isCodeExist: true,
        proof:
          '0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
      },
    }

    const action = await getHandleAcceptanceAction({
      client,
      emailAuthMsg,
      templateIdx: 0n,
    })
    expect(action.to).toEqual(GLOBAL_CONSTANTS.UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.target).toEqual(
      GLOBAL_CONSTANTS.UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    )
    expect(action.value).toEqual(0n)
    expect(action.callData).toBeDefined()
    expect(action.data).toBeDefined()
  })

  it('Should get handle recovery action', async () => {
    const emailAuthMsg: EmailAuthMsg = {
      templateId: 1n,
      commandParams: [
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
      ],
      skippedCommandPrefix: 0n,
      proof: {
        domainName: 'gmail.com',
        publicKeyHash:
          '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
        timestamp: 1709251200n, // 1st March 2024
        maskedCommand: 'recover account',
        emailNullifier:
          '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        accountSalt:
          '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
        isCodeExist: true,
        proof:
          '0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
      },
    }

    const action = await getHandleRecoveryAction({
      client,
      emailAuthMsg,
      templateIdx: 0n,
    })
    expect(action.to).toEqual(GLOBAL_CONSTANTS.UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.target).toEqual(
      GLOBAL_CONSTANTS.UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    )
    expect(action.value).toEqual(0n)
    expect(action.callData).toBeDefined()
    expect(action.data).toBeDefined()
  })

  it('Should get complete recovery action', async () => {
    const action = await getCompleteRecoveryAction({
      client,
      account: account.address,
      recoveryData: '0x',
    })
    expect(action.to).toEqual(GLOBAL_CONSTANTS.UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.target).toEqual(
      GLOBAL_CONSTANTS.UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    )
    expect(action.value).toEqual(0n)
    expect(action.callData).toBeDefined()
    expect(action.data).toBeDefined()
  })

  it('Should get cancel recovery action', async () => {
    const action = await getCancelRecoveryAction({ client })
    expect(action.to).toEqual(GLOBAL_CONSTANTS.UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.target).toEqual(
      GLOBAL_CONSTANTS.UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    )
    expect(action.value).toEqual(0n)
    expect(action.callData).toBeDefined()
    expect(action.data).toBeDefined()
  })

  it('Should get cancel expired recovery action', async () => {
    const action = await getCancelExpiredRecoveryAction({
      client,
      account: account.address,
    })
    expect(action.to).toEqual(GLOBAL_CONSTANTS.UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.target).toEqual(
      GLOBAL_CONSTANTS.UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    )
    expect(action.value).toEqual(0n)
    expect(action.callData).toBeDefined()
    expect(action.data).toBeDefined()
  })

  it('Should compute email auth address', async () => {
    const expectedEmailAuthAddress = getAddress(
      '0x4D27E1D29b6757c63BB452F2B7808489f8395DFD',
    )
    const emailAuthAddress = await computeEmailAuthAddress({
      client,
      recoveredAccount: account.address,
      accountSalt:
        '0x1b749df8845eee7644992f2d5c240a0b70fadb9129c6569df0c76abaded15ae6',
    })
    expect(emailAuthAddress).toEqual(expectedEmailAuthAddress)
  })

  it('Should get guardian config', async () => {
    const config = await getGuardianConfig({
      account,
      client,
    })
    expect(config.guardianCount).toEqual(0n)
    expect(config.totalWeight).toEqual(0n)
    expect(config.acceptedWeight).toEqual(0n)
    expect(config.threshold).toEqual(0n)
  })

  it('Should get guardian', async () => {
    const guardian = await getGuardian({
      account,
      client,
      guardian: guardians[0],
    })
    expect(guardian.status).toEqual(0)
    expect(guardian.weight).toEqual(0n)
  })

  it('Should get all guardians', async () => {
    const allGuardians = await getAllGuardians({
      account,
      client,
    })
    expect(allGuardians).toEqual([])
  })

  it('Should check if guardian has voted', async () => {
    const hasVoted = await hasGuardianVoted({
      account,
      client,
      guardian: guardians[0],
    })
    expect(hasVoted).toEqual(false)
  })

  it('Should get add guardian action', async () => {
    const action = await getAddGuardianAction({
      client,
      guardian: guardians[0],
      weight: weights[0],
    })
    expect(action.to).toEqual(GLOBAL_CONSTANTS.UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.target).toEqual(
      GLOBAL_CONSTANTS.UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    )
    expect(action.value).toEqual(0n)
    expect(action.callData).toBeDefined()
    expect(action.data).toBeDefined()
  })

  it('Should get remove guardian action', async () => {
    const action = await getRemoveGuardianAction({
      client,
      guardian: guardians[0],
    })
    expect(action.to).toEqual(GLOBAL_CONSTANTS.UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.target).toEqual(
      GLOBAL_CONSTANTS.UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    )
    expect(action.value).toEqual(0n)
    expect(action.callData).toBeDefined()
    expect(action.data).toBeDefined()
  })

  it('Should get change threshold action', async () => {
    const action = await getChangeThresholdAction({
      client,
      threshold,
    })
    expect(action.to).toEqual(GLOBAL_CONSTANTS.UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.target).toEqual(
      GLOBAL_CONSTANTS.UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    )
    expect(action.value).toEqual(0n)
    expect(action.callData).toBeDefined()
    expect(action.data).toBeDefined()
  })
})
