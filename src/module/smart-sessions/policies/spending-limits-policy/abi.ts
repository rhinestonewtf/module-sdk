export const abi = [
  {
    type: 'function',
    name: 'getPolicyData',
    inputs: [
      { internalType: 'ConfigId', name: 'id', type: 'bytes32' },
      { internalType: 'address', name: 'multiplexer', type: 'address' },
      { internalType: 'address', name: 'token', type: 'address' },
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
