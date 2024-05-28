export const AccountAbi = {
  abi: [
    { inputs: [], name: 'AccountAccessUnauthorized', type: 'error' },
    { inputs: [], name: 'AccountInitializationFailed', type: 'error' },
    { inputs: [], name: 'CannotRemoveLastValidator', type: 'error' },
    { inputs: [], name: 'ExecutionFailed', type: 'error' },
    {
      inputs: [
        { internalType: 'address', name: 'currentHook', type: 'address' },
      ],
      name: 'HookAlreadyInstalled',
      type: 'error',
    },
    { inputs: [], name: 'HookPostCheckFailed', type: 'error' },
    {
      inputs: [{ internalType: 'address', name: 'module', type: 'address' }],
      name: 'InvalidModule',
      type: 'error',
    },
    { inputs: [], name: 'LinkedList_AlreadyInitialized', type: 'error' },
    {
      inputs: [{ internalType: 'address', name: 'entry', type: 'address' }],
      name: 'LinkedList_EntryAlreadyInList',
      type: 'error',
    },
    {
      inputs: [{ internalType: 'address', name: 'entry', type: 'address' }],
      name: 'LinkedList_InvalidEntry',
      type: 'error',
    },
    { inputs: [], name: 'LinkedList_InvalidPage', type: 'error' },
    {
      inputs: [{ internalType: 'bytes4', name: 'selector', type: 'bytes4' }],
      name: 'NoFallbackHandler',
      type: 'error',
    },
    {
      inputs: [{ internalType: 'CallType', name: 'callType', type: 'bytes1' }],
      name: 'UnsupportedCallType',
      type: 'error',
    },
    {
      inputs: [{ internalType: 'ExecType', name: 'execType', type: 'bytes1' }],
      name: 'UnsupportedExecType',
      type: 'error',
    },
    {
      inputs: [
        { internalType: 'uint256', name: 'moduleTypeId', type: 'uint256' },
      ],
      name: 'UnsupportedModuleType',
      type: 'error',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'moduleTypeId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'module',
          type: 'address',
        },
      ],
      name: 'ModuleInstalled',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'moduleTypeId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'module',
          type: 'address',
        },
      ],
      name: 'ModuleUninstalled',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'batchExecutionindex',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'bytes',
          name: 'result',
          type: 'bytes',
        },
      ],
      name: 'TryExecuteUnsuccessful',
      type: 'event',
    },
    { stateMutability: 'payable', type: 'fallback' },
    {
      inputs: [],
      name: 'accountId',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'entryPoint',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'ModeCode', name: 'mode', type: 'bytes32' },
        { internalType: 'bytes', name: 'executionCalldata', type: 'bytes' },
      ],
      name: 'execute',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'ModeCode', name: 'mode', type: 'bytes32' },
        { internalType: 'bytes', name: 'executionCalldata', type: 'bytes' },
      ],
      name: 'executeFromExecutor',
      outputs: [
        { internalType: 'bytes[]', name: 'returnData', type: 'bytes[]' },
      ],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        {
          components: [
            { internalType: 'address', name: 'sender', type: 'address' },
            { internalType: 'uint256', name: 'nonce', type: 'uint256' },
            { internalType: 'bytes', name: 'initCode', type: 'bytes' },
            { internalType: 'bytes', name: 'callData', type: 'bytes' },
            {
              internalType: 'bytes32',
              name: 'accountGasLimits',
              type: 'bytes32',
            },
            {
              internalType: 'uint256',
              name: 'preVerificationGas',
              type: 'uint256',
            },
            { internalType: 'bytes32', name: 'gasFees', type: 'bytes32' },
            { internalType: 'bytes', name: 'paymasterAndData', type: 'bytes' },
            { internalType: 'bytes', name: 'signature', type: 'bytes' },
          ],
          internalType: 'struct PackedUserOperation',
          name: 'userOp',
          type: 'tuple',
        },
      ],
      name: 'executeUserOp',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes4', name: 'functionSig', type: 'bytes4' }],
      name: 'getActiveFallbackHandler',
      outputs: [
        {
          components: [
            { internalType: 'address', name: 'handler', type: 'address' },
            { internalType: 'CallType', name: 'calltype', type: 'bytes1' },
          ],
          internalType: 'struct ModuleManager.FallbackHandler',
          name: '',
          type: 'tuple',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getActiveHook',
      outputs: [{ internalType: 'address', name: 'hook', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'cursor', type: 'address' },
        { internalType: 'uint256', name: 'size', type: 'uint256' },
      ],
      name: 'getExecutorsPaginated',
      outputs: [
        { internalType: 'address[]', name: 'array', type: 'address[]' },
        { internalType: 'address', name: 'next', type: 'address' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'cursor', type: 'address' },
        { internalType: 'uint256', name: 'size', type: 'uint256' },
      ],
      name: 'getValidatorPaginated',
      outputs: [
        { internalType: 'address[]', name: 'array', type: 'address[]' },
        { internalType: 'address', name: 'next', type: 'address' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
      name: 'initializeAccount',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'uint256', name: 'moduleTypeId', type: 'uint256' },
        { internalType: 'address', name: 'module', type: 'address' },
        { internalType: 'bytes', name: 'initData', type: 'bytes' },
      ],
      name: 'installModule',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'uint256', name: 'moduleTypeId', type: 'uint256' },
        { internalType: 'address', name: 'module', type: 'address' },
        { internalType: 'bytes', name: 'additionalContext', type: 'bytes' },
      ],
      name: 'isModuleInstalled',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'hash', type: 'bytes32' },
        { internalType: 'bytes', name: 'data', type: 'bytes' },
      ],
      name: 'isValidSignature',
      outputs: [{ internalType: 'bytes4', name: '', type: 'bytes4' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'ModeCode', name: 'mode', type: 'bytes32' }],
      name: 'supportsExecutionMode',
      outputs: [{ internalType: 'bool', name: 'isSupported', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'uint256', name: 'modulTypeId', type: 'uint256' },
      ],
      name: 'supportsModule',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'uint256', name: 'moduleTypeId', type: 'uint256' },
        { internalType: 'address', name: 'module', type: 'address' },
        { internalType: 'bytes', name: 'deInitData', type: 'bytes' },
      ],
      name: 'uninstallModule',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        {
          components: [
            { internalType: 'address', name: 'sender', type: 'address' },
            { internalType: 'uint256', name: 'nonce', type: 'uint256' },
            { internalType: 'bytes', name: 'initCode', type: 'bytes' },
            { internalType: 'bytes', name: 'callData', type: 'bytes' },
            {
              internalType: 'bytes32',
              name: 'accountGasLimits',
              type: 'bytes32',
            },
            {
              internalType: 'uint256',
              name: 'preVerificationGas',
              type: 'uint256',
            },
            { internalType: 'bytes32', name: 'gasFees', type: 'bytes32' },
            { internalType: 'bytes', name: 'paymasterAndData', type: 'bytes' },
            { internalType: 'bytes', name: 'signature', type: 'bytes' },
          ],
          internalType: 'struct PackedUserOperation',
          name: 'userOp',
          type: 'tuple',
        },
        { internalType: 'bytes32', name: 'userOpHash', type: 'bytes32' },
        {
          internalType: 'uint256',
          name: 'missingAccountFunds',
          type: 'uint256',
        },
      ],
      name: 'validateUserOp',
      outputs: [
        { internalType: 'uint256', name: 'validSignature', type: 'uint256' },
      ],
      stateMutability: 'payable',
      type: 'function',
    },
    { stateMutability: 'payable', type: 'receive' },
  ],
}
