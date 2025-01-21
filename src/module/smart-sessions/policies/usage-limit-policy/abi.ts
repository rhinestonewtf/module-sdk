export const abi = [
  {
    "type": "function",
    "name": "checkAction",
    "inputs": [
      { "name": "id", "type": "bytes32", "internalType": "ConfigId" },
      { "name": "account", "type": "address", "internalType": "address" },
      { "name": "", "type": "address", "internalType": "address" },
      { "name": "", "type": "uint256", "internalType": "uint256" },
      { "name": "", "type": "bytes", "internalType": "bytes" }
    ],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "checkUserOpPolicy",
    "inputs": [
      { "name": "id", "type": "bytes32", "internalType": "ConfigId" },
      {
        "name": "op",
        "type": "tuple",
        "internalType": "struct PackedUserOperation",
        "components": [
          { "name": "sender", "type": "address", "internalType": "address" },
          { "name": "nonce", "type": "uint256", "internalType": "uint256" },
          { "name": "initCode", "type": "bytes", "internalType": "bytes" },
          { "name": "callData", "type": "bytes", "internalType": "bytes" },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          { "name": "gasFees", "type": "bytes32", "internalType": "bytes32" },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          { "name": "signature", "type": "bytes", "internalType": "bytes" }
        ]
      }
    ],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getUsageLimit",
    "inputs": [
      { "name": "id", "type": "bytes32", "internalType": "ConfigId" },
      { "name": "mxer", "type": "address", "internalType": "address" },
      { "name": "smartAccount", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      { "name": "limit", "type": "uint128", "internalType": "uint128" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUsed",
    "inputs": [
      { "name": "id", "type": "bytes32", "internalType": "ConfigId" },
      { "name": "mxer", "type": "address", "internalType": "address" },
      { "name": "smartAccount", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      { "name": "used", "type": "uint128", "internalType": "uint128" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "initializeWithMultiplexer",
    "inputs": [
      { "name": "account", "type": "address", "internalType": "address" },
      { "name": "configId", "type": "bytes32", "internalType": "ConfigId" },
      { "name": "initData", "type": "bytes", "internalType": "bytes" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "supportsInterface",
    "inputs": [
      { "name": "interfaceID", "type": "bytes4", "internalType": "bytes4" }
    ],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "usageLimitConfigs",
    "inputs": [
      { "name": "id", "type": "bytes32", "internalType": "ConfigId" },
      { "name": "msgSender", "type": "address", "internalType": "address" },
      { "name": "userOpSender", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      { "name": "limit", "type": "uint128", "internalType": "uint128" },
      { "name": "used", "type": "uint128", "internalType": "uint128" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "PolicySet",
    "inputs": [
      {
        "name": "id",
        "type": "bytes32",
        "indexed": false,
        "internalType": "ConfigId"
      },
      {
        "name": "multiplexer",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "account",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "PolicyNotInitialized",
    "inputs": [
      { "name": "id", "type": "bytes32", "internalType": "ConfigId" },
      { "name": "multiplexer", "type": "address", "internalType": "address" },
      { "name": "account", "type": "address", "internalType": "address" }
    ]
  }
]