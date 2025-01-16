export const abi = [
  {
    type: 'function',
    name: 'getTimeFrameConfig',
    inputs: [
      { name: 'id', type: 'uint256', internalType: 'uint256' },
      { name: 'multiplexer', type: 'address', internalType: 'address' },
      { name: 'smartAccount', type: 'address', internalType: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
]
