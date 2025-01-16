export const abi = [
  {
    type: 'function',
    name: 'getPolicyData',
    inputs: [
      { name: 'id', type: 'uint256', internalType: 'uint256' },
      { name: 'multiplexer', type: 'address', internalType: 'address' },
      { name: 'token', type: 'address', internalType: 'address' },
      { name: 'userOpSender', type: 'address', internalType: 'address' },
    ],
    outputs: [
      { name: 'spendingLimit', type: 'uint256', internalType: 'uint256' },
      { name: 'alreadySpent', type: 'uint256', internalType: 'uint256' },
      { name: 'approvedAmount', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'view',
  },
]
