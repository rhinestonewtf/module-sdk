export const abi = [
  {
    type: 'function',
    name: 'usageLimitConfigs',
    inputs: [
      { name: 'id', type: 'uint256', internalType: 'uint256' },
      { name: 'msgSender', type: 'address', internalType: 'address' },
      { name: 'userOpSender', type: 'address', internalType: 'address' },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct UsageLimitPolicy.UsageLimitConfig',
        components: [
          { name: 'limit', type: 'uint128', internalType: 'uint128' },
          { name: 'used', type: 'uint128', internalType: 'uint128' },
        ],
      },
    ],
    stateMutability: 'view',
  },
]
