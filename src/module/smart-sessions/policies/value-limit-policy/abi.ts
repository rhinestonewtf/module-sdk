export const abi = [
  {
    inputs: [
      { internalType: 'ConfigId', name: 'id', type: 'bytes32' },
      { internalType: 'address', name: 'multiplexer', type: 'address' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'PolicyNotInitialized',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'CallType', name: 'callType', type: 'bytes1' }],
    name: 'UnsupportedCallType',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'ConfigId', name: 'id', type: 'bytes32' },
      {
        indexed: false,
        internalType: 'address',
        name: 'multiplexer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'PolicySet',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'ConfigId', name: 'id', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'bytes', name: '', type: 'bytes' },
    ],
    name: 'checkAction',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'ConfigId', name: 'id', type: 'bytes32' },
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
        name: 'op',
        type: 'tuple',
      },
    ],
    name: 'checkUserOpPolicy',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'ConfigId', name: 'configId', type: 'bytes32' },
      { internalType: 'address', name: 'msgSender', type: 'address' },
      { internalType: 'address', name: 'userOpSender', type: 'address' },
    ],
    name: 'getUsed',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'ConfigId', name: 'configId', type: 'bytes32' },
      { internalType: 'address', name: 'msgSender', type: 'address' },
      { internalType: 'address', name: 'userOpSender', type: 'address' },
    ],
    name: 'getValueLimit',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'ConfigId', name: 'configId', type: 'bytes32' },
      { internalType: 'bytes', name: 'initData', type: 'bytes' },
    ],
    name: 'initializeWithMultiplexer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'interfaceID', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'ConfigId', name: 'id', type: 'bytes32' },
      { internalType: 'address', name: 'msgSender', type: 'address' },
      { internalType: 'address', name: 'userOpSender', type: 'address' },
    ],
    name: 'valueLimitConfigs',
    outputs: [
      { internalType: 'uint256', name: 'valueLimit', type: 'uint256' },
      { internalType: 'uint256', name: 'limitUsed', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]
