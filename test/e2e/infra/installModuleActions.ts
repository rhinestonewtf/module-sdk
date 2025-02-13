import { installModule } from 'src/account'
import {
  getOwnableValidator,
  getWebAuthnValidator,
  getScheduledOrdersExecutor,
  getScheduledTransfersExecutor,
  getSmartSessionsValidator,
} from 'src/module'
import { Account } from 'src/account'
import {
  Address,
  encodeAbiParameters,
  encodePacked,
  getAddress,
  Hex,
  PublicClient,
  toBytes,
  toFunctionSelector,
  toHex,
  zeroAddress,
} from 'viem'
import { CallType } from 'src/module/types'
import { SafeHookType } from 'src/account/safe/types'
import { getSudoPolicy } from 'src/module/smart-sessions/policies/sudo-policy'
import { privateKeyToAccount } from 'viem/accounts'
import { getOwnableExecutor } from 'src/module/ownable-executor'
import { getSocialRecoveryValidator } from 'src/module/social-recovery/installation'
import { getAutoSavingsExecutor } from 'src/module/auto-savings'
import {
  getAllowedCallbackSenders,
  getColdStorageHook,
} from 'src/module/cold-storage'
import { getHookMultiPlexer } from 'src/module/hook-multi-plexer'
import { getDeadmanSwitch } from 'src/module/deadman-switch'
import { getMultiFactorValidator } from 'src/module/multi-factor-validator'
import { getUniversalEmailRecoveryExecutor } from 'src/module/zk-email-recovery/universal-email-recovery'
import { sepolia } from 'viem/chains'
import { getSmartSessionsCompatibilityFallback } from 'src/module/smart-sessions'
import { GLOBAL_CONSTANTS } from 'src/constants'

type Params = {
  account: Account
  client: PublicClient
}

export const getInstallModuleActions = async ({ account, client }: Params) => {
  const {
    ownableValidator,
    webAuthnValidator,
    ownableExecutor,
    socialRecoveryValidator,
    autoSavingExecutor,
    deadmanSwitchValidator,
    multiFactorValidator,
    virtualCodeStorageExecutor,
    allowedCallbackSendersFallback,
    scheduledOrdersExecutor,
    scheduledTransfersExecutor,
    hookMultiPlexer,
    smartSessions,
    universalEmailRecoveryExecutor,
  } = getInstallModuleData({
    account,
  })

  // install ownable validator
  const installOwnableValidatorAction = await installModule({
    client,
    account,
    module: getOwnableValidator(ownableValidator),
  })

  // install webauthn validator
  const installWebAuthnValidatorAction = await installModule({
    client,
    account,
    module: getWebAuthnValidator(webAuthnValidator),
  })

  // install ownable executor
  const installOwnableExecutorAction = await installModule({
    client,
    account,
    module: getOwnableExecutor(ownableExecutor),
  })

  // install social recovery
  const installSocialRecoveryAction = await installModule({
    client,
    account,
    module: getSocialRecoveryValidator(socialRecoveryValidator),
  })

  // install auto savings executor
  const installAutoSavingsExecutorAction = await installModule({
    client,
    account,
    module: getAutoSavingsExecutor(autoSavingExecutor),
  })

  // install deadman switch validator
  const installDeadmanSwitchValidatorAction = await installModule({
    client,
    account,
    module: await getDeadmanSwitch({
      ...deadmanSwitchValidator,
      account,
      client,
    }),
  })

  // install multi factor validator
  const installMultiFactorValidatorAction = await installModule({
    client,
    account,
    module: getMultiFactorValidator(multiFactorValidator),
  })

  // install virtual code storage hook
  const installVirtualCodeStorageExecutorAction = await installModule({
    client,
    account,
    module: await getColdStorageHook({
      account,
      client,
      ...virtualCodeStorageExecutor,
    }),
  })

  // install callback senders
  const installCallbackSendersAction = await installModule({
    client,
    account,
    module: getAllowedCallbackSenders(allowedCallbackSendersFallback),
  })

  // install scheduled orders executor
  const installScheduledOrdersExecutorAction = await installModule({
    client,
    account,
    module: getScheduledOrdersExecutor(scheduledOrdersExecutor),
  })

  // install scheduled transfers executor
  const installScheduledTransfersExecutorAction = await installModule({
    client,
    account,
    module: getScheduledTransfersExecutor(scheduledTransfersExecutor),
  })

  // install hook multi plexer
  const installHookMultiplexerAction = await installModule({
    client,
    account,
    module: getHookMultiPlexer(hookMultiPlexer),
  })

  // install smart sessions validator
  const installSmartSessionsValidatorAction = await installModule({
    client,
    account,
    module: getSmartSessionsValidator(smartSessions),
  })

  // Only install fallback for erc7579-implementation accounts
  const installSmartSessionsFallbackAction =
    account.type === 'erc7579-implementation'
      ? await installModule({
          client,
          account,
          module: getSmartSessionsCompatibilityFallback(),
        })
      : []
  // install universal email recovery executor
  const installUniversalEmailRecoveryAction = await installModule({
    client,
    account,
    module: getUniversalEmailRecoveryExecutor(universalEmailRecoveryExecutor),
  })

  return [
    ...installSmartSessionsValidatorAction,
    ...installOwnableValidatorAction,
    ...installSmartSessionsFallbackAction,
    ...installWebAuthnValidatorAction,
    ...installOwnableExecutorAction,
    ...installSocialRecoveryAction,
    ...installAutoSavingsExecutorAction,
    ...installDeadmanSwitchValidatorAction,
    ...installMultiFactorValidatorAction,
    ...installVirtualCodeStorageExecutorAction,
    ...installCallbackSendersAction,
    ...installScheduledOrdersExecutorAction,
    ...installScheduledTransfersExecutorAction,
    ...installHookMultiplexerAction,
    ...installUniversalEmailRecoveryAction,
  ]
}

export const getInstallModuleData = ({ account }: Pick<Params, 'account'>) => ({
  ownableValidator: {
    threshold: 1,
    owners: [
      privateKeyToAccount(
        '0xf8e4de715b5cddc791e98d9110abe9e05117fbe5004e2241374ea654e7bf15fe' as Hex,
      ).address,
      privateKeyToAccount(process.env.PRIVATE_KEY as Hex).address,
    ],
    hook: zeroAddress,
  },
  webAuthnValidator: {
    pubKey: { x: 123n, y: 456n },
    authenticatorId: 'authenticatorId',
    hook: zeroAddress,
  },
  ownableExecutor: {
    owner: account.address,
    hook: zeroAddress,
  },
  socialRecoveryValidator: {
    threshold: 1,
    guardians: [account.address],
    hook: zeroAddress,
  },
  registryHook: {
    registryAddress: GLOBAL_CONSTANTS.REGISTRY_ADDRESS as Address,
  },
  autoSavingExecutor: {
    chainId: sepolia.id as number,
    configs: [
      {
        token: '0x96C9b8422f930a4a47c1e3df01103A282ee6EE04' as Address,
        percentage: BigInt(10 * 100),
        vault: '0xd921f0dF3B56899F26F658809aaa161cdfC2359F' as Address,
      },
    ],
    hook: zeroAddress,
  },
  deadmanSwitchValidator: {
    moduleType: 'validator' as any,
    nominee: account.address,
    timeout: 1000,
    hook: zeroAddress,
  },
  multiFactorValidator: {
    threshold: 1,
    validators: [
      {
        packedValidatorAndId: encodePacked(
          ['bytes12', 'address'],
          [
            '0x000000000000000000000000',
            GLOBAL_CONSTANTS.OWNABLE_VALIDATOR_ADDRESS,
          ],
        ),
        data: '0x41414141' as Hex,
      },
    ],
    hook: zeroAddress,
  },
  virtualCodeStorageExecutor: {
    waitPeriod: 1000,
    owner: '0x206f270A1eBB6Dd3Bc97581376168014FD6eE57c' as Address,
    moduleType: 'executor' as any,
    hook: zeroAddress,
  },
  allowedCallbackSendersFallback: {
    addresses: [account.address] as Address[],
    functionSig: '0x00000000' as Hex,
    selector: '0x00000000' as Hex,
    hook: zeroAddress,
    callType: CallType.CALLTYPE_SINGLE,
  },
  scheduledOrdersExecutor: {
    chainId: sepolia.id as number,
    executeInterval: 100,
    numberOfExecutions: 10,
    startDate: new Date().getTime(),
    executionData: '0x' as Hex,
    hook: zeroAddress,
  },
  scheduledTransfersExecutor: {
    executeInterval: 100,
    numberOfExecutions: 10,
    startDate: new Date().getTime(),
    executionData: '0x' as Hex,
    hook: zeroAddress,
  },
  hookMultiPlexer: {
    globalHooks: [],
    valueHooks: [],
    delegatecallHooks: [],
    targetHooks: [],
    sigHooks: [],
    selector: '0x00000000' as Hex,
    hookType: SafeHookType.GLOBAL,
  },
  smartSessions: {
    sessions: [
      {
        sessionValidator: GLOBAL_CONSTANTS.OWNABLE_VALIDATOR_ADDRESS,
        sessionValidatorInitData: encodeAbiParameters(
          [
            {
              type: 'uint256',
            },
            {
              type: 'address[]',
            },
          ],
          [
            BigInt(1),
            [privateKeyToAccount(process.env.PRIVATE_KEY as Hex).address],
          ],
        ),
        salt: toHex(toBytes('2', { size: 32 })),
        userOpPolicies: [],
        erc7739Policies: {
          allowedERC7739Content: [],
          erc1271Policies: [],
        },
        actions: [
          {
            actionTarget:
              '0xa564cB165815937967a7d018B7F34B907B52fcFd' as Address,
            actionTargetSelector: '0x00000000' as Hex,
            actionPolicies: [
              {
                policy: getSudoPolicy().address,
                initData: getSudoPolicy().initData,
              },
            ],
          },
        ],
        permitERC4337Paymaster: false,
        chainId: BigInt(sepolia.id),
      },
    ],
    hook: zeroAddress,
  },
  universalEmailRecoveryExecutor: {
    validator: GLOBAL_CONSTANTS.OWNABLE_VALIDATOR_ADDRESS,
    isInstalledContext: toHex(0),
    initialSelector: toFunctionSelector('function addOwner(address)'),
    guardians: [
      getAddress('0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3'),
      getAddress('0x9FF36a253C70b65122B47c70F2AfaF65F2957118'),
    ],
    weights: [1n, 2n],
    threshold: 2n,
    delay: 60n * 60n * 6n, // 6 hours
    expiry: 2n * 7n * 24n * 60n * 60n, // 2 days
    chainId: sepolia.id,
    hook: zeroAddress,
  },
})
