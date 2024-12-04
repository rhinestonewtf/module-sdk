import { getAddress, toFunctionSelector, toHex, zeroAddress } from 'viem'
import { getUniversalEmailRecoveryExecutor } from 'src/module/zk-email-recovery/universal-email-recovery/installation'
import { UNIVERSAL_EMAIL_RECOVERY_ADDRESS } from 'src/module/zk-email-recovery/universal-email-recovery/constants'
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
import { OWNABLE_VALIDATOR_ADDRESS } from 'src/module'

describe('Universal Email Recovery Module', () => {
  // Setup
  const client = getClient(MockClient)
  const account = getAccount(MockAccountDeployed)

  const validator = OWNABLE_VALIDATOR_ADDRESS
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
    })

    expect(installUniversalEmailModule.address).toEqual(
      UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    )
    expect(installUniversalEmailModule.module).toEqual(
      UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
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

  it('Should get allow validator recovery action', () => {
    const action = getAllowValidatorRecoveryAction({
      validator,
      isInstalledContext,
      recoverySelector: initialSelector,
    })
    expect(action.to).toEqual(UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.target).toEqual(UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.value).toEqual(0n)
    expect(action.callData).toBeDefined()
    expect(action.data).toBeDefined()
  })

  it('Should get disallow validator recovery action', () => {
    const prevValidator = '0xD990393C670dCcE8b4d8F858FB98c9912dBFAa06'
    const action = getDisallowValidatorRecoveryAction({
      validator,
      prevValidator,
      recoverySelector: initialSelector,
    })
    expect(action.to).toEqual(UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.target).toEqual(UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
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
      '0x0D5C8bcae3A3589F2CFbb04895933717aA5098e1',
    )
    const verifier = await getVerifier({
      client,
    })
    expect(verifier).toEqual(expectedVerifier)
  })

  it('Should get DKIM', async () => {
    const expectedDkim = getAddress(
      '0x1D2B1F8cF98382e53C7735F05ef84d51FEd8Eff6',
    )
    const dkim = await getDkim({
      client,
    })
    expect(dkim).toEqual(expectedDkim)
  })

  it('Should get email auth implementation', async () => {
    const expectedEmailAuth = getAddress(
      '0xCa4d16459b7AC7b348016244f1fA49d3f87b6F3F',
    )
    const emailAuthImplementation = await getEmailAuthImplementation({
      client,
    })
    expect(emailAuthImplementation).toEqual(expectedEmailAuth)
  })

  it('Should get update recovery config action', () => {
    const action = getUpdateRecoveryConfigAction({
      delay,
      expiry,
    })
    expect(action.to).toEqual(UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.target).toEqual(UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.value).toEqual(0n)
    expect(action.callData).toBeDefined()
    expect(action.data).toBeDefined()
  })

  it('Should get handle acceptance action', () => {
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

    const action = getHandleAcceptanceAction({
      emailAuthMsg,
      templateIdx: 0n,
    })
    expect(action.to).toEqual(UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.target).toEqual(UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.value).toEqual(0n)
    expect(action.callData).toBeDefined()
    expect(action.data).toBeDefined()
  })

  it('Should get handle recovery action', () => {
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

    const action = getHandleRecoveryAction({
      emailAuthMsg,
      templateIdx: 0n,
    })
    expect(action.to).toEqual(UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.target).toEqual(UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.value).toEqual(0n)
    expect(action.callData).toBeDefined()
    expect(action.data).toBeDefined()
  })

  it('Should get complete recovery action', () => {
    const action = getCompleteRecoveryAction({
      account: account.address,
      recoveryData: '0x',
    })
    expect(action.to).toEqual(UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.target).toEqual(UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.value).toEqual(0n)
    expect(action.callData).toBeDefined()
    expect(action.data).toBeDefined()
  })

  it('Should get cancel recovery action', () => {
    const action = getCancelRecoveryAction()
    expect(action.to).toEqual(UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.target).toEqual(UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.value).toEqual(0n)
    expect(action.callData).toBeDefined()
    expect(action.data).toBeDefined()
  })

  it('Should get cancel expired recovery action', () => {
    const action = getCancelExpiredRecoveryAction({
      account: account.address,
    })
    expect(action.to).toEqual(UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.target).toEqual(UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.value).toEqual(0n)
    expect(action.callData).toBeDefined()
    expect(action.data).toBeDefined()
  })

  it('Should compute email auth address', async () => {
    const expectedEmailAuthAddress = getAddress(
      '0x81e375B511FA247B22D09519f37ddaa661cbd59a',
    )
    const emailAuthAddress = await computeEmailAuthAddress({
      client,
      recoveredAccount: account.address,
      accountSalt:
        '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
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

  it('Should get add guardian action', () => {
    const action = getAddGuardianAction({
      guardian: guardians[0],
      weight: weights[0],
    })
    expect(action.to).toEqual(UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.target).toEqual(UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.value).toEqual(0n)
    expect(action.callData).toBeDefined()
    expect(action.data).toBeDefined()
  })

  it('Should get remove guardian action', () => {
    const action = getRemoveGuardianAction({
      guardian: guardians[0],
    })
    expect(action.to).toEqual(UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.target).toEqual(UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.value).toEqual(0n)
    expect(action.callData).toBeDefined()
    expect(action.data).toBeDefined()
  })

  it('Should get change threshold action', () => {
    const action = getChangeThresholdAction({
      threshold: threshold,
    })
    expect(action.to).toEqual(UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.target).toEqual(UNIVERSAL_EMAIL_RECOVERY_ADDRESS)
    expect(action.value).toEqual(0n)
    expect(action.callData).toBeDefined()
    expect(action.data).toBeDefined()
  })
})
