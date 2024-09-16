export const abi = [
  {
    inputs: [{ internalType: 'bytes', name: 'orderData', type: 'bytes' }],
    name: 'addOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'jobId', type: 'uint256' }],
    name: 'executeOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'jobId', type: 'uint256' }],
    name: 'toggleOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
