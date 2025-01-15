export const abi = [
  {
    type: 'function',
    name: 'valueLimitConfigs',
    inputs: [
      { name: 'id', type: 'uint256', internalType: 'uint256' },
      { name: 'msgSender', type: 'address', internalType: 'address' },
      { name: 'userOpSender', type: 'address', internalType: 'address' },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct ValueLimitPolicy.ValueLimitConfig',
        components: [
          { name: 'valueLimit', type: 'uint256', internalType: 'uint256' },
          { name: 'limitUsed', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
]

