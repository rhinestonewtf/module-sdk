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
  { inputs: [], name: 'HooksNotSorted', type: 'error' },
  {
    inputs: [
      { internalType: 'address', name: 'smartAccount', type: 'address' },
    ],
    name: 'NotInitialized',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'subHook', type: 'address' }],
    name: 'SubHookPostCheckError',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'subHook', type: 'address' }],
    name: 'SubHookPreCheckError',
    type: 'error',
  },
  { inputs: [], name: 'UnsupportedHookType', type: 'error' },
  {
    inputs: [],
    name: 'REGISTRY',
    outputs: [{ internalType: 'contract IERC7484', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'hook', type: 'address' },
      { internalType: 'enum HookType', name: 'hookType', type: 'uint8' },
    ],
    name: 'addHook',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'hook', type: 'address' },
      { internalType: 'bytes4', name: 'sig', type: 'bytes4' },
      { internalType: 'enum HookType', name: 'hookType', type: 'uint8' },
    ],
    name: 'addSigHook',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'getHooks',
    outputs: [{ internalType: 'address[]', name: 'hooks', type: 'address[]' }],
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
    inputs: [{ internalType: 'bytes', name: 'hookData', type: 'bytes' }],
    name: 'postCheck',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'msgSender', type: 'address' },
      { internalType: 'uint256', name: 'msgValue', type: 'uint256' },
      { internalType: 'bytes', name: 'msgData', type: 'bytes' },
    ],
    name: 'preCheck',
    outputs: [{ internalType: 'bytes', name: 'hookData', type: 'bytes' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'hook', type: 'address' },
      { internalType: 'enum HookType', name: 'hookType', type: 'uint8' },
    ],
    name: 'removeHook',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'hook', type: 'address' },
      { internalType: 'bytes4', name: 'sig', type: 'bytes4' },
      { internalType: 'enum HookType', name: 'hookType', type: 'uint8' },
    ],
    name: 'removeSigHook',
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
