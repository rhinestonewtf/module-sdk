export const abi = [
  {
    inputs: [
      { internalType: 'address', name: 'smartAccount', type: 'address' },
    ],
    name: 'AlreadyInitialized',
    type: 'error',
  },
  { inputs: [], name: 'InvalidSqrtPriceLimitX96', type: 'error' },
  { inputs: [], name: 'LinkedList_AlreadyInitialized', type: 'error' },
  {
    inputs: [{ internalType: 'address', name: 'entry', type: 'address' }],
    name: 'LinkedList_EntryAlreadyInList',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'entry', type: 'address' }],
    name: 'LinkedList_InvalidEntry',
    type: 'error',
  },
  { inputs: [], name: 'LinkedList_InvalidPage', type: 'error' },
  {
    inputs: [
      { internalType: 'address', name: 'smartAccount', type: 'address' },
    ],
    name: 'NotInitialized',
    type: 'error',
  },
  { inputs: [], name: 'TooManyTokens', type: 'error' },
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
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountReceived',
        type: 'uint256',
      },
    ],
    name: 'AutoSaveExecuted',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'amountReceived', type: 'uint256' },
      { internalType: 'uint160', name: 'sqrtPriceLimitX96', type: 'uint160' },
      { internalType: 'uint256', name: 'amountOutMinimum', type: 'uint256' },
      { internalType: 'uint24', name: 'fee', type: 'uint24' },
    ],
    name: 'autoSave',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'amountReceived', type: 'uint256' },
      { internalType: 'uint256', name: 'percentage', type: 'uint256' },
    ],
    name: 'calcDepositAmount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'address', name: 'token', type: 'address' },
    ],
    name: 'config',
    outputs: [
      { internalType: 'uint64', name: 'percentage', type: 'uint64' },
      { internalType: 'address', name: 'vault', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'prevToken', type: 'address' },
      { internalType: 'address', name: 'token', type: 'address' },
    ],
    name: 'deleteConfig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'getTokens',
    outputs: [
      { internalType: 'address[]', name: 'tokensArray', type: 'address[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'smartAccount', type: 'address' },
    ],
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
      { internalType: 'address', name: 'token', type: 'address' },
      {
        components: [
          { internalType: 'uint64', name: 'percentage', type: 'uint64' },
          { internalType: 'address', name: 'vault', type: 'address' },
        ],
        internalType: 'struct AutoSavings.Config',
        name: '_config',
        type: 'tuple',
      },
    ],
    name: 'setConfig',
    outputs: [],
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
