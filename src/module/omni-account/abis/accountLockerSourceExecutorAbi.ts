export const accountLockerSourceExecutorAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'orchestrator',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'resourceLockHook',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'bridgeIntentNonces',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
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
    name: 'handleAcross',
    inputs: [
      {
        name: 'payload',
        type: 'tuple',
        internalType: 'struct OriginModulePayload',
        components: [
          {
            name: 'order',
            type: 'tuple',
            internalType: 'struct Order',
            components: [
              {
                name: 'settlement',
                type: 'tuple',
                internalType: 'struct Settlement',
                components: [
                  {
                    name: 'orchestrator',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'recipient',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'settlementContract',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'targetAccount',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'targetChainId',
                    type: 'uint64',
                    internalType: 'uint64',
                  },
                  {
                    name: 'fillDeadline',
                    type: 'uint32',
                    internalType: 'uint32',
                  },
                  {
                    name: 'lastDepositId',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                ],
              },
              {
                name: 'acrossTransfer',
                type: 'tuple',
                internalType: 'struct AcrossTransfer',
                components: [
                  {
                    name: 'originModule',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'originAccount',
                    type: 'address',
                    internalType: 'address',
                  },
                  {
                    name: 'originChainId',
                    type: 'uint64',
                    internalType: 'uint64',
                  },
                  {
                    name: 'initiateDeadline',
                    type: 'uint32',
                    internalType: 'uint32',
                  },
                  {
                    name: 'maxFee',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'depositId',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'originTransfer',
                    type: 'tuple',
                    internalType: 'struct TokenTransfer',
                    components: [
                      {
                        name: 'tokenAddress',
                        type: 'address',
                        internalType: 'address',
                      },
                      {
                        name: 'amount',
                        type: 'uint256',
                        internalType: 'uint256',
                      },
                    ],
                  },
                  {
                    name: 'targetTransfer',
                    type: 'tuple',
                    internalType: 'struct TokenTransfer',
                    components: [
                      {
                        name: 'tokenAddress',
                        type: 'address',
                        internalType: 'address',
                      },
                      {
                        name: 'amount',
                        type: 'uint256',
                        internalType: 'uint256',
                      },
                    ],
                  },
                ],
              },
              {
                name: 'smartDigests',
                type: 'tuple',
                internalType: 'struct SmartDigest',
                components: [
                  {
                    name: 'acrossTransferDigests',
                    type: 'tuple',
                    internalType: 'struct IndexChainDigest',
                    components: [
                      {
                        name: 'digestIndex',
                        type: 'uint256',
                        internalType: 'uint256',
                      },
                      {
                        name: 'chainDataDigests',
                        type: 'bytes32[]',
                        internalType: 'bytes32[]',
                      },
                    ],
                  },
                  {
                    name: 'executionDigest',
                    type: 'bytes32',
                    internalType: 'bytes32',
                  },
                  {
                    name: 'userOpDigest',
                    type: 'bytes32',
                    internalType: 'bytes32',
                  },
                ],
              },
              { name: 'userSig', type: 'bytes', internalType: 'bytes' },
            ],
          },
          {
            name: 'auctionFee',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'orchestratorSig',
            type: 'bytes',
            internalType: 'bytes',
          },
          {
            name: 'acrossMessagePayload',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'eip712Domain',
    inputs: [],
    outputs: [
      {
        name: 'fields',
        type: 'bytes1',
        internalType: 'bytes1',
      },
      {
        name: 'name',
        type: 'string',
        internalType: 'string',
      },
      {
        name: 'version',
        type: 'string',
        internalType: 'string',
      },
      {
        name: 'chainId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'verifyingContract',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'salt',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'extensions',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isInitialized',
    inputs: [
      {
        name: 'smartAccount',
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
    name: 'name',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
        internalType: 'string',
      },
    ],
    stateMutability: 'view',
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
    name: 'registerApprovalSpend',
    inputs: [
      {
        name: 'approvalSpend',
        type: 'tuple',
        internalType: 'struct ApprovalSpend',
        components: [
          {
            name: 'account',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'token',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'amount',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
      {
        name: 'orchestratorSignature',
        type: 'bytes',
        internalType: 'bytes',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'unlockFundsForAccount',
    inputs: [
      {
        name: 'orchestratorSignature',
        type: 'bytes',
        internalType: 'bytes',
      },
      {
        name: 'request',
        type: 'tuple',
        internalType: 'struct WithdrawRequest',
        components: [
          {
            name: 'timestamp',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'tokenAddress',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'orchestrator',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'amount',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'nonce',
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
    name: 'version',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
        internalType: 'string',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'withdrawNonces',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
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
    name: 'InvalidChainId',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidNonce',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidOrchestratorSignature',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidSender',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidTimestamp',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidUserSignature',
    inputs: [],
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
]
