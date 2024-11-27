export const abi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'verifier',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'dkimRegistry',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'emailAuthImpl',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'commandHandler',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'minimumDelay',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'killSwitchAuthorizer',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'CANCEL_EXPIRED_RECOVERY_COOLDOWN',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'MAX_VALIDATORS',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'MINIMUM_RECOVERY_WINDOW',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'acceptanceCommandTemplates',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string[][]',
        internalType: 'string[][]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'addGuardian',
    inputs: [
      {
        name: 'guardian',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'weight',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'allowValidatorRecovery',
    inputs: [
      {
        name: 'validator',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'isInstalledContext',
        type: 'bytes',
        internalType: 'bytes',
      },
      {
        name: 'recoverySelector',
        type: 'bytes4',
        internalType: 'bytes4',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'canStartRecoveryRequest',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'validator',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'cancelExpiredRecovery',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'cancelRecovery',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'changeThreshold',
    inputs: [
      {
        name: 'threshold',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'commandHandler',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'completeRecovery',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'recoveryData',
        type: 'bytes',
        internalType: 'bytes',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'computeAcceptanceTemplateId',
    inputs: [
      {
        name: 'templateIdx',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'computeEmailAuthAddress',
    inputs: [
      {
        name: 'recoveredAccount',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'accountSalt',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'computeRecoveryTemplateId',
    inputs: [
      {
        name: 'templateIdx',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'disallowValidatorRecovery',
    inputs: [
      {
        name: 'validator',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'prevValidator',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'recoverySelector',
        type: 'bytes4',
        internalType: 'bytes4',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'dkim',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'dkimAddr',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'emailAuthImplementation',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'emailAuthImplementationAddr',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'extractRecoveredAccountFromAcceptanceCommand',
    inputs: [
      {
        name: 'commandParams',
        type: 'bytes[]',
        internalType: 'bytes[]',
      },
      {
        name: 'templateIdx',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'extractRecoveredAccountFromRecoveryCommand',
    inputs: [
      {
        name: 'commandParams',
        type: 'bytes[]',
        internalType: 'bytes[]',
      },
      {
        name: 'templateIdx',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getAllGuardians',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address[]',
        internalType: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getAllowedSelectors',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bytes4[]',
        internalType: 'bytes4[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getAllowedValidators',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address[]',
        internalType: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getGuardian',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'guardian',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct GuardianStorage',
        components: [
          {
            name: 'status',
            type: 'uint8',
            internalType: 'enum GuardianStatus',
          },
          {
            name: 'weight',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getGuardianConfig',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct IGuardianManager.GuardianConfig',
        components: [
          {
            name: 'guardianCount',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'totalWeight',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'acceptedWeight',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'threshold',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getPreviousRecoveryRequest',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct IEmailRecoveryManager.PreviousRecoveryRequest',
        components: [
          {
            name: 'previousGuardianInitiated',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'cancelRecoveryCooldown',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getRecoveryConfig',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct IEmailRecoveryManager.RecoveryConfig',
        components: [
          {
            name: 'delay',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'expiry',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getRecoveryRequest',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: 'executeAfter',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'executeBefore',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'currentWeight',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'recoveryDataHash',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'handleAcceptance',
    inputs: [
      {
        name: 'emailAuthMsg',
        type: 'tuple',
        internalType: 'struct EmailAuthMsg',
        components: [
          {
            name: 'templateId',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'commandParams',
            type: 'bytes[]',
            internalType: 'bytes[]',
          },
          {
            name: 'skippedCommandPrefix',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'proof',
            type: 'tuple',
            internalType: 'struct EmailProof',
            components: [
              {
                name: 'domainName',
                type: 'string',
                internalType: 'string',
              },
              {
                name: 'publicKeyHash',
                type: 'bytes32',
                internalType: 'bytes32',
              },
              {
                name: 'timestamp',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'maskedCommand',
                type: 'string',
                internalType: 'string',
              },
              {
                name: 'emailNullifier',
                type: 'bytes32',
                internalType: 'bytes32',
              },
              {
                name: 'accountSalt',
                type: 'bytes32',
                internalType: 'bytes32',
              },
              {
                name: 'isCodeExist',
                type: 'bool',
                internalType: 'bool',
              },
              {
                name: 'proof',
                type: 'bytes',
                internalType: 'bytes',
              },
            ],
          },
        ],
      },
      {
        name: 'templateIdx',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'handleRecovery',
    inputs: [
      {
        name: 'emailAuthMsg',
        type: 'tuple',
        internalType: 'struct EmailAuthMsg',
        components: [
          {
            name: 'templateId',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'commandParams',
            type: 'bytes[]',
            internalType: 'bytes[]',
          },
          {
            name: 'skippedCommandPrefix',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'proof',
            type: 'tuple',
            internalType: 'struct EmailProof',
            components: [
              {
                name: 'domainName',
                type: 'string',
                internalType: 'string',
              },
              {
                name: 'publicKeyHash',
                type: 'bytes32',
                internalType: 'bytes32',
              },
              {
                name: 'timestamp',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'maskedCommand',
                type: 'string',
                internalType: 'string',
              },
              {
                name: 'emailNullifier',
                type: 'bytes32',
                internalType: 'bytes32',
              },
              {
                name: 'accountSalt',
                type: 'bytes32',
                internalType: 'bytes32',
              },
              {
                name: 'isCodeExist',
                type: 'bool',
                internalType: 'bool',
              },
              {
                name: 'proof',
                type: 'bytes',
                internalType: 'bytes',
              },
            ],
          },
        ],
      },
      {
        name: 'templateIdx',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'hasGuardianVoted',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'guardian',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isActivated',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isInitialized',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isModuleType',
    inputs: [
      {
        name: 'typeID',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'killSwitchEnabled',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'minimumDelay',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'name',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
        internalType: 'string',
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'onInstall',
    inputs: [
      {
        name: 'data',
        type: 'bytes',
        internalType: 'bytes',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'onUninstall',
    inputs: [
      {
        name: '',
        type: 'bytes',
        internalType: 'bytes',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'recoveryCommandTemplates',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string[][]',
        internalType: 'string[][]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'removeGuardian',
    inputs: [
      {
        name: 'guardian',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'renounceOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'toggleKillSwitch',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferOwnership',
    inputs: [
      {
        name: 'newOwner',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateRecoveryConfig',
    inputs: [
      {
        name: 'recoveryConfig',
        type: 'tuple',
        internalType: 'struct IEmailRecoveryManager.RecoveryConfig',
        components: [
          {
            name: 'delay',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'expiry',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'validatorCount',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: 'count',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'verifier',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'verifierAddr',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'version',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
        internalType: 'string',
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'event',
    name: 'AddedGuardian',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'guardian',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'weight',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ChangedThreshold',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'threshold',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'GuardianAccepted',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'guardian',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'GuardianStatusUpdated',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'guardian',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'newStatus',
        type: 'uint8',
        indexed: false,
        internalType: 'enum GuardianStatus',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'GuardianVoted',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'guardian',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'currentWeight',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'guardianWeight',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'NewValidatorRecovery',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'validator',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'recoverySelector',
        type: 'bytes4',
        indexed: false,
        internalType: 'bytes4',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RecoveryCancelled',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RecoveryCompleted',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RecoveryConfigUpdated',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'delay',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'expiry',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RecoveryConfigured',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'guardianCount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'totalWeight',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'threshold',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RecoveryDeInitialized',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RecoveryExecuted',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'validator',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RecoveryRequestComplete',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'guardian',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'executeAfter',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'executeBefore',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'recoveryDataHash',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RecoveryRequestStarted',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'guardian',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'executeBefore',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'recoveryDataHash',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RemovedGuardian',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'guardian',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'weight',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RemovedValidatorRecovery',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'validator',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'recoverySelector',
        type: 'bytes4',
        indexed: false,
        internalType: 'bytes4',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'AccountNotConfigured',
    inputs: [],
  },
  {
    type: 'error',
    name: 'AddressAlreadyGuardian',
    inputs: [],
  },
  {
    type: 'error',
    name: 'AddressNotGuardianForAccount',
    inputs: [],
  },
  {
    type: 'error',
    name: 'AlreadyInitialized',
    inputs: [
      {
        name: 'smartAccount',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'DelayLessThanMinimumDelay',
    inputs: [
      {
        name: 'delay',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'minimumDelay',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'DelayMoreThanExpiry',
    inputs: [
      {
        name: 'delay',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'expiry',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'DelayNotPassed',
    inputs: [
      {
        name: 'blockTimestamp',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'executeAfter',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'GuardianAlreadyVoted',
    inputs: [],
  },
  {
    type: 'error',
    name: 'GuardianMustWaitForCooldown',
    inputs: [
      {
        name: 'guardian',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'IncorrectNumberOfWeights',
    inputs: [
      {
        name: 'guardianCount',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'weightCount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidAccountAddress',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidCommandHandler',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidDkimRegistry',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidEmailAuthImpl',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidFactory',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidGuardianAddress',
    inputs: [
      {
        name: 'guardian',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidGuardianStatus',
    inputs: [
      {
        name: 'guardianStatus',
        type: 'uint8',
        internalType: 'enum GuardianStatus',
      },
      {
        name: 'expectedGuardianStatus',
        type: 'uint8',
        internalType: 'enum GuardianStatus',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidGuardianWeight',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidKillSwitchAuthorizer',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidOnInstallData',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidProxyBytecodeHash',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidRecoveryDataHash',
    inputs: [
      {
        name: 'recoveryDataHash',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'expectedRecoveryDataHash',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidSelector',
    inputs: [
      {
        name: 'selector',
        type: 'bytes4',
        internalType: 'bytes4',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidValidator',
    inputs: [
      {
        name: 'validator',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidVerifier',
    inputs: [],
  },
  {
    type: 'error',
    name: 'KillSwitchEnabled',
    inputs: [],
  },
  {
    type: 'error',
    name: 'LinkedList_AlreadyInitialized',
    inputs: [],
  },
  {
    type: 'error',
    name: 'LinkedList_EntryAlreadyInList',
    inputs: [
      {
        name: 'entry',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'LinkedList_InvalidEntry',
    inputs: [
      {
        name: 'entry',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'LinkedList_InvalidPage',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MaxNumberOfGuardiansReached',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MaxValidatorsReached',
    inputs: [],
  },
  {
    type: 'error',
    name: 'NoRecoveryConfigured',
    inputs: [],
  },
  {
    type: 'error',
    name: 'NoRecoveryInProcess',
    inputs: [],
  },
  {
    type: 'error',
    name: 'NotEnoughApprovals',
    inputs: [
      {
        name: 'currentWeight',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'threshold',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'NotInitialized',
    inputs: [
      {
        name: 'smartAccount',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'OwnableInvalidOwner',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'OwnableUnauthorizedAccount',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'RecoveryHasNotExpired',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'blockTimestamp',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'executeBefore',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'RecoveryInProcess',
    inputs: [],
  },
  {
    type: 'error',
    name: 'RecoveryIsNotActivated',
    inputs: [],
  },
  {
    type: 'error',
    name: 'RecoveryModuleNotInitialized',
    inputs: [],
  },
  {
    type: 'error',
    name: 'RecoveryRequestExpired',
    inputs: [
      {
        name: 'blockTimestamp',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'executeBefore',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'RecoveryWindowTooShort',
    inputs: [
      {
        name: 'recoveryWindow',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'SetupAlreadyCalled',
    inputs: [],
  },
  {
    type: 'error',
    name: 'SetupNotCalled',
    inputs: [],
  },
  {
    type: 'error',
    name: 'StatusCannotBeTheSame',
    inputs: [
      {
        name: 'newStatus',
        type: 'uint8',
        internalType: 'enum GuardianStatus',
      },
    ],
  },
  {
    type: 'error',
    name: 'ThresholdCannotBeZero',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ThresholdExceedsAcceptedWeight',
    inputs: [
      {
        name: 'threshold',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'acceptedWeight',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'ThresholdExceedsTotalWeight',
    inputs: [
      {
        name: 'threshold',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'totalWeight',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'TooManyValuesToRemove',
    inputs: [],
  },
] as const
