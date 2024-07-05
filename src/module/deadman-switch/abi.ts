export const abi = [
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'config',
    outputs: [
      { internalType: 'uint48', name: 'lastAccess', type: 'uint48' },
      { internalType: 'uint48', name: 'timeout', type: 'uint48' },
      { internalType: 'address', name: 'nominee', type: 'address' },
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
]
