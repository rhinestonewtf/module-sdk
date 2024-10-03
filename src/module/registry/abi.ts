export const abi = [
  { inputs: [], name: 'AccessDenied', type: 'error' },
  { inputs: [], name: 'AlreadyAttested', type: 'error' },
  {
    inputs: [{ internalType: 'address', name: 'module', type: 'address' }],
    name: 'AlreadyRegistered',
    type: 'error',
  },
  { inputs: [], name: 'AlreadyRevoked', type: 'error' },
  { inputs: [], name: 'AttestationNotFound', type: 'error' },
  { inputs: [], name: 'DifferentResolvers', type: 'error' },
  { inputs: [], name: 'ExternalError_ModuleRegistration', type: 'error' },
  { inputs: [], name: 'ExternalError_ResolveAttestation', type: 'error' },
  { inputs: [], name: 'ExternalError_ResolveRevocation', type: 'error' },
  { inputs: [], name: 'ExternalError_SchemaValidation', type: 'error' },
  {
    inputs: [{ internalType: 'address', name: 'factory', type: 'address' }],
    name: 'FactoryCallFailed',
    type: 'error',
  },
  { inputs: [], name: 'InsufficientAttestations', type: 'error' },
  { inputs: [], name: 'InvalidAddress', type: 'error' },
  { inputs: [], name: 'InvalidAttestation', type: 'error' },
  { inputs: [], name: 'InvalidDeployment', type: 'error' },
  { inputs: [], name: 'InvalidExpirationTime', type: 'error' },
  { inputs: [], name: 'InvalidModuleType', type: 'error' },
  { inputs: [], name: 'InvalidModuleTypes', type: 'error' },
  {
    inputs: [
      {
        internalType: 'contract IExternalResolver',
        name: 'resolver',
        type: 'address',
      },
    ],
    name: 'InvalidResolver',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'ResolverUID', name: 'uid', type: 'bytes32' }],
    name: 'InvalidResolverUID',
    type: 'error',
  },
  { inputs: [], name: 'InvalidSalt', type: 'error' },
  { inputs: [], name: 'InvalidSchema', type: 'error' },
  {
    inputs: [
      {
        internalType: 'contract IExternalSchemaValidator',
        name: 'validator',
        type: 'address',
      },
    ],
    name: 'InvalidSchemaValidator',
    type: 'error',
  },
  { inputs: [], name: 'InvalidSignature', type: 'error' },
  { inputs: [], name: 'InvalidThreshold', type: 'error' },
  { inputs: [], name: 'InvalidTrustedAttesterInput', type: 'error' },
  {
    inputs: [
      { internalType: 'address', name: 'moduleAddress', type: 'address' },
    ],
    name: 'ModuleAddressIsNotContract',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'module', type: 'address' }],
    name: 'ModuleNotFoundInRegistry',
    type: 'error',
  },
  { inputs: [], name: 'NoTrustedAttestersFound', type: 'error' },
  { inputs: [], name: 'ResolverAlreadyExists', type: 'error' },
  {
    inputs: [{ internalType: 'address', name: 'attester', type: 'address' }],
    name: 'RevokedAttestation',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'SchemaUID', name: 'uid', type: 'bytes32' }],
    name: 'SchemaAlreadyExists',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'moduleAddress',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'attester',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'SchemaUID',
        name: 'schemaUID',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'AttestationDataRef',
        name: 'sstore2Pointer',
        type: 'address',
      },
    ],
    name: 'Attested',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address',
      },
    ],
    name: 'ModuleRegistration',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'ResolverUID',
        name: 'uid',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'resolver',
        type: 'address',
      },
    ],
    name: 'NewResolver',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'ResolverUID',
        name: 'uid',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'NewResolverOwner',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'smartAccount',
        type: 'address',
      },
    ],
    name: 'NewTrustedAttesters',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'contract IExternalResolver',
        name: 'resolver',
        type: 'address',
      },
    ],
    name: 'ResolverRevocationError',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'moduleAddress',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'revoker',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'SchemaUID',
        name: 'schema',
        type: 'bytes32',
      },
    ],
    name: 'Revoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'SchemaUID',
        name: 'uid',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'registerer',
        type: 'address',
      },
    ],
    name: 'SchemaRegistered',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'SchemaUID', name: 'schemaUID', type: 'bytes32' },
      { internalType: 'address', name: 'attester', type: 'address' },
      {
        components: [
          { internalType: 'address', name: 'moduleAddress', type: 'address' },
          { internalType: 'uint48', name: 'expirationTime', type: 'uint48' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          {
            internalType: 'ModuleType[]',
            name: 'moduleTypes',
            type: 'uint256[]',
          },
        ],
        internalType: 'struct AttestationRequest[]',
        name: 'requests',
        type: 'tuple[]',
      },
      { internalType: 'bytes', name: 'signature', type: 'bytes' },
    ],
    name: 'attest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'SchemaUID', name: 'schemaUID', type: 'bytes32' },
      { internalType: 'address', name: 'attester', type: 'address' },
      {
        components: [
          { internalType: 'address', name: 'moduleAddress', type: 'address' },
          { internalType: 'uint48', name: 'expirationTime', type: 'uint48' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          {
            internalType: 'ModuleType[]',
            name: 'moduleTypes',
            type: 'uint256[]',
          },
        ],
        internalType: 'struct AttestationRequest',
        name: 'request',
        type: 'tuple',
      },
      { internalType: 'bytes', name: 'signature', type: 'bytes' },
    ],
    name: 'attest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'SchemaUID', name: 'schemaUID', type: 'bytes32' },
      {
        components: [
          { internalType: 'address', name: 'moduleAddress', type: 'address' },
          { internalType: 'uint48', name: 'expirationTime', type: 'uint48' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          {
            internalType: 'ModuleType[]',
            name: 'moduleTypes',
            type: 'uint256[]',
          },
        ],
        internalType: 'struct AttestationRequest',
        name: 'request',
        type: 'tuple',
      },
    ],
    name: 'attest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'SchemaUID', name: 'schemaUID', type: 'bytes32' },
      {
        components: [
          { internalType: 'address', name: 'moduleAddress', type: 'address' },
          { internalType: 'uint48', name: 'expirationTime', type: 'uint48' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          {
            internalType: 'ModuleType[]',
            name: 'moduleTypes',
            type: 'uint256[]',
          },
        ],
        internalType: 'struct AttestationRequest[]',
        name: 'requests',
        type: 'tuple[]',
      },
    ],
    name: 'attest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'attester', type: 'address' }],
    name: 'attesterNonce',
    outputs: [{ internalType: 'uint256', name: 'nonce', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'salt', type: 'bytes32' },
      { internalType: 'bytes', name: 'initCode', type: 'bytes' },
    ],
    name: 'calcModuleAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'module', type: 'address' },
      { internalType: 'address[]', name: 'attesters', type: 'address[]' },
      { internalType: 'uint256', name: 'threshold', type: 'uint256' },
    ],
    name: 'check',
    outputs: [],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'module', type: 'address' },
      { internalType: 'ModuleType', name: 'moduleType', type: 'uint256' },
      { internalType: 'address[]', name: 'attesters', type: 'address[]' },
      { internalType: 'uint256', name: 'threshold', type: 'uint256' },
    ],
    name: 'check',
    outputs: [],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'module', type: 'address' },
      { internalType: 'ModuleType', name: 'moduleType', type: 'uint256' },
    ],
    name: 'check',
    outputs: [],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'module', type: 'address' }],
    name: 'check',
    outputs: [],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'smartAccount', type: 'address' },
      { internalType: 'address', name: 'module', type: 'address' },
    ],
    name: 'checkForAccount',
    outputs: [],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'smartAccount', type: 'address' },
      { internalType: 'address', name: 'module', type: 'address' },
      { internalType: 'ModuleType', name: 'moduleType', type: 'uint256' },
    ],
    name: 'checkForAccount',
    outputs: [],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'salt', type: 'bytes32' },
      { internalType: 'ResolverUID', name: 'resolverUID', type: 'bytes32' },
      { internalType: 'bytes', name: 'initCode', type: 'bytes' },
      { internalType: 'bytes', name: 'metadata', type: 'bytes' },
      { internalType: 'bytes', name: 'resolverContext', type: 'bytes' },
    ],
    name: 'deployModule',
    outputs: [
      { internalType: 'address', name: 'moduleAddress', type: 'address' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'factory', type: 'address' },
      { internalType: 'bytes', name: 'callOnFactory', type: 'bytes' },
      { internalType: 'bytes', name: 'metadata', type: 'bytes' },
      { internalType: 'ResolverUID', name: 'resolverUID', type: 'bytes32' },
      { internalType: 'bytes', name: 'resolverContext', type: 'bytes' },
    ],
    name: 'deployViaFactory',
    outputs: [
      { internalType: 'address', name: 'moduleAddress', type: 'address' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { internalType: 'bytes1', name: 'fields', type: 'bytes1' },
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'version', type: 'string' },
      { internalType: 'uint256', name: 'chainId', type: 'uint256' },
      { internalType: 'address', name: 'verifyingContract', type: 'address' },
      { internalType: 'bytes32', name: 'salt', type: 'bytes32' },
      { internalType: 'uint256[]', name: 'extensions', type: 'uint256[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'module', type: 'address' },
      { internalType: 'address', name: 'attester', type: 'address' },
    ],
    name: 'findAttestation',
    outputs: [
      {
        components: [
          { internalType: 'uint48', name: 'time', type: 'uint48' },
          { internalType: 'uint48', name: 'expirationTime', type: 'uint48' },
          { internalType: 'uint48', name: 'revocationTime', type: 'uint48' },
          {
            internalType: 'PackedModuleTypes',
            name: 'moduleTypes',
            type: 'uint32',
          },
          { internalType: 'address', name: 'moduleAddress', type: 'address' },
          { internalType: 'address', name: 'attester', type: 'address' },
          {
            internalType: 'AttestationDataRef',
            name: 'dataPointer',
            type: 'address',
          },
          { internalType: 'SchemaUID', name: 'schemaUID', type: 'bytes32' },
        ],
        internalType: 'struct AttestationRecord',
        name: 'attestation',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'module', type: 'address' },
      { internalType: 'address[]', name: 'attesters', type: 'address[]' },
    ],
    name: 'findAttestations',
    outputs: [
      {
        components: [
          { internalType: 'uint48', name: 'time', type: 'uint48' },
          { internalType: 'uint48', name: 'expirationTime', type: 'uint48' },
          { internalType: 'uint48', name: 'revocationTime', type: 'uint48' },
          {
            internalType: 'PackedModuleTypes',
            name: 'moduleTypes',
            type: 'uint32',
          },
          { internalType: 'address', name: 'moduleAddress', type: 'address' },
          { internalType: 'address', name: 'attester', type: 'address' },
          {
            internalType: 'AttestationDataRef',
            name: 'dataPointer',
            type: 'address',
          },
          { internalType: 'SchemaUID', name: 'schemaUID', type: 'bytes32' },
        ],
        internalType: 'struct AttestationRecord[]',
        name: 'attestations',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'moduleAddress', type: 'address' },
    ],
    name: 'findModule',
    outputs: [
      {
        components: [
          { internalType: 'ResolverUID', name: 'resolverUID', type: 'bytes32' },
          { internalType: 'address', name: 'sender', type: 'address' },
          { internalType: 'bytes', name: 'metadata', type: 'bytes' },
        ],
        internalType: 'struct ModuleRecord',
        name: 'moduleRecord',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'ResolverUID', name: 'uid', type: 'bytes32' }],
    name: 'findResolver',
    outputs: [
      {
        components: [
          {
            internalType: 'contract IExternalResolver',
            name: 'resolver',
            type: 'address',
          },
          { internalType: 'address', name: 'resolverOwner', type: 'address' },
        ],
        internalType: 'struct ResolverRecord',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'SchemaUID', name: 'uid', type: 'bytes32' }],
    name: 'findSchema',
    outputs: [
      {
        components: [
          { internalType: 'uint48', name: 'registeredAt', type: 'uint48' },
          {
            internalType: 'contract IExternalSchemaValidator',
            name: 'validator',
            type: 'address',
          },
          { internalType: 'string', name: 'schema', type: 'string' },
        ],
        internalType: 'struct SchemaRecord',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'smartAccount', type: 'address' },
    ],
    name: 'findTrustedAttesters',
    outputs: [
      { internalType: 'address[]', name: 'attesters', type: 'address[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'moduleAddress', type: 'address' },
          { internalType: 'uint48', name: 'expirationTime', type: 'uint48' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          {
            internalType: 'ModuleType[]',
            name: 'moduleTypes',
            type: 'uint256[]',
          },
        ],
        internalType: 'struct AttestationRequest',
        name: 'request',
        type: 'tuple',
      },
      { internalType: 'address', name: 'attester', type: 'address' },
    ],
    name: 'getDigest',
    outputs: [{ internalType: 'bytes32', name: 'digest', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'moduleAddress', type: 'address' },
        ],
        internalType: 'struct RevocationRequest[]',
        name: 'requests',
        type: 'tuple[]',
      },
      { internalType: 'address', name: 'attester', type: 'address' },
    ],
    name: 'getDigest',
    outputs: [{ internalType: 'bytes32', name: 'digest', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'moduleAddress', type: 'address' },
        ],
        internalType: 'struct RevocationRequest',
        name: 'request',
        type: 'tuple',
      },
      { internalType: 'address', name: 'attester', type: 'address' },
    ],
    name: 'getDigest',
    outputs: [{ internalType: 'bytes32', name: 'digest', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'moduleAddress', type: 'address' },
          { internalType: 'uint48', name: 'expirationTime', type: 'uint48' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          {
            internalType: 'ModuleType[]',
            name: 'moduleTypes',
            type: 'uint256[]',
          },
        ],
        internalType: 'struct AttestationRequest[]',
        name: 'requests',
        type: 'tuple[]',
      },
      { internalType: 'address', name: 'attester', type: 'address' },
    ],
    name: 'getDigest',
    outputs: [{ internalType: 'bytes32', name: 'digest', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'ResolverUID', name: 'resolverUID', type: 'bytes32' },
      { internalType: 'address', name: 'moduleAddress', type: 'address' },
      { internalType: 'bytes', name: 'metadata', type: 'bytes' },
      { internalType: 'bytes', name: 'resolverContext', type: 'bytes' },
    ],
    name: 'registerModule',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IExternalResolver',
        name: 'resolver',
        type: 'address',
      },
    ],
    name: 'registerResolver',
    outputs: [{ internalType: 'ResolverUID', name: 'uid', type: 'bytes32' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: 'schema', type: 'string' },
      {
        internalType: 'contract IExternalSchemaValidator',
        name: 'validator',
        type: 'address',
      },
    ],
    name: 'registerSchema',
    outputs: [{ internalType: 'SchemaUID', name: 'uid', type: 'bytes32' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'moduleAddress', type: 'address' },
        ],
        internalType: 'struct RevocationRequest[]',
        name: 'requests',
        type: 'tuple[]',
      },
    ],
    name: 'revoke',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'attester', type: 'address' },
      {
        components: [
          { internalType: 'address', name: 'moduleAddress', type: 'address' },
        ],
        internalType: 'struct RevocationRequest[]',
        name: 'requests',
        type: 'tuple[]',
      },
      { internalType: 'bytes', name: 'signature', type: 'bytes' },
    ],
    name: 'revoke',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'moduleAddress', type: 'address' },
        ],
        internalType: 'struct RevocationRequest',
        name: 'request',
        type: 'tuple',
      },
    ],
    name: 'revoke',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'attester', type: 'address' },
      {
        components: [
          { internalType: 'address', name: 'moduleAddress', type: 'address' },
        ],
        internalType: 'struct RevocationRequest',
        name: 'request',
        type: 'tuple',
      },
      { internalType: 'bytes', name: 'signature', type: 'bytes' },
    ],
    name: 'revoke',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'ResolverUID', name: 'uid', type: 'bytes32' },
      {
        internalType: 'contract IExternalResolver',
        name: 'resolver',
        type: 'address',
      },
    ],
    name: 'setResolver',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'ResolverUID', name: 'uid', type: 'bytes32' },
      { internalType: 'address', name: 'newOwner', type: 'address' },
    ],
    name: 'transferResolverOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint8', name: 'threshold', type: 'uint8' },
      { internalType: 'address[]', name: 'attesters', type: 'address[]' },
    ],
    name: 'trustAttesters',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
