export const abi = [
  {
    inputs: [{ internalType: 'bytes', name: 'orderData', type: 'bytes' }],
    name: 'addOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'jobId', type: 'uint256' },
      { internalType: 'uint160', name: 'sqrtPriceLimitX96', type: 'uint160' },
      { internalType: 'uint256', name: 'amountOutMinimum', type: 'uint256' },
      { internalType: 'uint24', name: 'fee', type: 'uint24' },
    ],
    name: 'executeOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
