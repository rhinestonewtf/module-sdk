export const abi = [
  {
    type: 'function',
    name: 'actionConfigs',
    inputs: [
      { name: 'id', type: 'bytes32', internalType: 'ConfigId' },
      { name: 'msgSender', type: 'address', internalType: 'address' },
      { name: 'userOpSender', type: 'address', internalType: 'address' },
    ],
    outputs: [
      {
        name: 'valueLimitPerUse',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'paramRules',
        type: 'tuple',
        internalType: 'struct ParamRules',
        components: [
          { name: 'length', type: 'uint256', internalType: 'uint256' },
          {
            name: 'rules',
            type: 'tuple[16]',
            internalType: 'struct ParamRule[16]',
            components: [
              {
                name: 'condition',
                type: 'uint8',
                internalType: 'enum ParamCondition',
              },
              {
                name: 'offset',
                type: 'uint64',
                internalType: 'uint64',
              },
              { name: 'isLimited', type: 'bool', internalType: 'bool' },
              { name: 'ref', type: 'bytes32', internalType: 'bytes32' },
              {
                name: 'usage',
                type: 'tuple',
                internalType: 'struct LimitUsage',
                components: [
                  {
                    name: 'limit',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'used',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'checkAction',
    inputs: [
      { name: 'id', type: 'bytes32', internalType: 'ConfigId' },
      { name: 'account', type: 'address', internalType: 'address' },
      { name: '', type: 'address', internalType: 'address' },
      { name: 'value', type: 'uint256', internalType: 'uint256' },
      { name: 'data', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'nonpayable',
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
    type: 'error',
    name: 'PolicyNotInitialized',
    inputs: [
      { name: 'id', type: 'bytes32', internalType: 'ConfigId' },
      { name: 'multiplexer', type: 'address', internalType: 'address' },
      { name: 'account', type: 'address', internalType: 'address' },
    ],
  },
  {
    type: 'error',
    name: 'ValueLimitExceeded',
    inputs: [
      { name: 'id', type: 'bytes32', internalType: 'ConfigId' },
      { name: 'value', type: 'uint256', internalType: 'uint256' },
      { name: 'limit', type: 'uint256', internalType: 'uint256' },
    ],
  },
]
