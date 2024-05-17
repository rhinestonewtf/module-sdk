export const abi = [
  {
    inputs: [
      { internalType: 'contract IERC7484', name: '_registry', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      { internalType: 'address', name: 'smartAccount', type: 'address' },
    ],
    name: 'AlreadyInitialized',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'length', type: 'uint256' },
      { internalType: 'uint256', name: 'threshold', type: 'uint256' },
    ],
    name: 'InvalidThreshold',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'smartAccount', type: 'address' },
    ],
    name: 'NotInitialized',
    type: 'error',
  },
  { inputs: [], name: 'ZeroThreshold', type: 'error' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'smartAccount',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'iteration',
        type: 'uint256',
      },
    ],
    name: 'IterationIncreased',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'smartAccount',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'validator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'ValidatorId',
        name: 'id',
        type: 'bytes12',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'iteration',
        type: 'uint256',
      },
    ],
    name: 'ValidatorAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'smartAccount',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'validator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'ValidatorId',
        name: 'id',
        type: 'bytes12',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'iteration',
        type: 'uint256',
      },
    ],
    name: 'ValidatorRemoved',
    type: 'event',
  },
  {
    inputs: [],
    name: 'REGISTRY',
    outputs: [{ internalType: 'contract IERC7484', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'accountConfig',
    outputs: [
      { internalType: 'uint8', name: 'threshold', type: 'uint8' },
      { internalType: 'uint128', name: 'iteration', type: 'uint128' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'isInitialized',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'typeID', type: 'uint256' }],
    name: 'isModuleType',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'address', name: 'subValidator', type: 'address' },
      { internalType: 'ValidatorId', name: 'id', type: 'bytes12' },
    ],
    name: 'isSubValidator',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'bytes32', name: 'hash', type: 'bytes32' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'isValidSignatureWithSender',
    outputs: [{ internalType: 'bytes4', name: '', type: 'bytes4' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
    name: 'onInstall',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    name: 'onUninstall',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'validatorAddress', type: 'address' },
      { internalType: 'ValidatorId', name: 'id', type: 'bytes12' },
    ],
    name: 'removeValidator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint8', name: 'threshold', type: 'uint8' }],
    name: 'setThreshold',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'validatorAddress', type: 'address' },
      { internalType: 'ValidatorId', name: 'id', type: 'bytes12' },
      { internalType: 'bytes', name: 'newValidatorData', type: 'bytes' },
    ],
    name: 'setValidator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'sender', type: 'address' },
          { internalType: 'uint256', name: 'nonce', type: 'uint256' },
          { internalType: 'bytes', name: 'initCode', type: 'bytes' },
          { internalType: 'bytes', name: 'callData', type: 'bytes' },
          {
            internalType: 'bytes32',
            name: 'accountGasLimits',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'preVerificationGas',
            type: 'uint256',
          },
          { internalType: 'bytes32', name: 'gasFees', type: 'bytes32' },
          { internalType: 'bytes', name: 'paymasterAndData', type: 'bytes' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct PackedUserOperation',
        name: 'userOp',
        type: 'tuple',
      },
      { internalType: 'bytes32', name: 'userOpHash', type: 'bytes32' },
    ],
    name: 'validateUserOp',
    outputs: [
      {
        internalType: 'ERC7579ValidatorBase.ValidationData',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'version',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'pure',
    type: 'function',
  },
]
