export const abi = [
  {
    inputs: [
      { internalType: 'address', name: 'smartAccount', type: 'address' },
    ],
    name: 'AlreadyInitialized',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'InvalidOwner',
    type: 'error',
  },
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
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'OwnerAlreadyExists',
    type: 'error',
  },
  { inputs: [], name: 'UnauthorizedAccess', type: 'error' },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'addOwner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'ownedAccount', type: 'address' },
      { internalType: 'bytes', name: 'callData', type: 'bytes' },
    ],
    name: 'executeBatchOnOwnedAccount',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'ownedAccount', type: 'address' },
      { internalType: 'bytes', name: 'callData', type: 'bytes' },
    ],
    name: 'executeOnOwnedAccount',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'getOwners',
    outputs: [
      { internalType: 'address[]', name: 'ownersArray', type: 'address[]' },
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
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'ownerCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'prevOwner', type: 'address' },
      { internalType: 'address', name: 'owner', type: 'address' },
    ],
    name: 'removeOwner',
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
