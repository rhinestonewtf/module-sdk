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
    inputs: [
      { internalType: 'ConfigId', name: 'id', type: 'bytes32' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'uint256', name: 'limit', type: 'uint256' },
    ],
    name: 'ValueLimitExceeded',
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
      { internalType: 'address', name: 'msgSender', type: 'address' },
      { internalType: 'address', name: 'userOpSender', type: 'address' },
    ],
    name: 'actionConfigs',
    outputs: [
      { internalType: 'uint256', name: 'valueLimitPerUse', type: 'uint256' },
      {
        components: [
          { internalType: 'uint256', name: 'length', type: 'uint256' },
          {
            components: [
              {
                internalType: 'enum ParamCondition',
                name: 'condition',
                type: 'uint8',
              },
              { internalType: 'uint64', name: 'offset', type: 'uint64' },
              { internalType: 'bool', name: 'isLimited', type: 'bool' },
              { internalType: 'bytes32', name: 'ref', type: 'bytes32' },
              {
                components: [
                  { internalType: 'uint256', name: 'limit', type: 'uint256' },
                  { internalType: 'uint256', name: 'used', type: 'uint256' },
                ],
                internalType: 'struct LimitUsage',
                name: 'usage',
                type: 'tuple',
              },
            ],
            internalType: 'struct ParamRule[16]',
            name: 'rules',
            type: 'tuple[16]',
          },
        ],
        internalType: 'struct ParamRules',
        name: 'paramRules',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'ConfigId', name: 'id', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'checkAction',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
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
]
