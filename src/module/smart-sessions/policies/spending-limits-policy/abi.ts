export const abi = [
  {
    type: 'function',
    name: 'checkAction',
    inputs: [
      { name: 'id', type: 'bytes32', internalType: 'ConfigId' },
      { name: 'account', type: 'address', internalType: 'address' },
      { name: 'target', type: 'address', internalType: 'address' },
      { name: 'value', type: 'uint256', internalType: 'uint256' },
      { name: 'callData', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getPolicyData',
    inputs: [
      { name: 'id', type: 'bytes32', internalType: 'ConfigId' },
      { name: 'multiplexer', type: 'address', internalType: 'address' },
      { name: 'token', type: 'address', internalType: 'address' },
      { name: 'userOpSender', type: 'address', internalType: 'address' },
    ],
    outputs: [
      {
        name: 'spendingLimit',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'alreadySpent',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'approvedAmount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'initializeWithMultiplexer',
    inputs: [
      { name: 'account', type: 'address', internalType: 'address' },
      { name: 'configId', type: 'bytes32', internalType: 'ConfigId' },
      { name: 'initData', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'supportsInterface',
    inputs: [{ name: 'interfaceID', type: 'bytes4', internalType: 'bytes4' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'event',
    name: 'PolicySet',
    inputs: [
      {
        name: 'id',
        type: 'bytes32',
        indexed: false,
        internalType: 'ConfigId',
      },
      {
        name: 'multiplexer',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'account',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'TokenSpent',
    inputs: [
      {
        name: 'id',
        type: 'bytes32',
        indexed: false,
        internalType: 'ConfigId',
      },
      {
        name: 'multiplexer',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'token',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'account',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'remaining',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'InvalidLimit',
    inputs: [{ name: 'limit', type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'error',
    name: 'InvalidTokenAddress',
    inputs: [{ name: 'token', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'PolicyNotInitialized',
    inputs: [
      { name: 'id', type: 'bytes32', internalType: 'ConfigId' },
      { name: 'multiplexer', type: 'address', internalType: 'address' },
      { name: 'account', type: 'address', internalType: 'address' },
    ],
  },
]
