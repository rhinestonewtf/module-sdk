export const abi = [
  [
    {
      type: 'function',
      name: 'actionConfigs',
      inputs: [
        { name: 'id', type: 'uint256', internalType: 'uint256' },
        { name: 'msgSender', type: 'address', internalType: 'address' },
        { name: 'userOpSender', type: 'address', internalType: 'address' },
      ],
      outputs: [
        {
          name: '',
          type: 'tuple',
          internalType: 'struct ActionConfig',
          components: [
            {
              name: 'valueLimitPerUse',
              type: 'uint256',
              internalType: 'uint256',
            },
            {
              name: 'paramRules',
              type: 'tuple',
              internalType: 'struct ParamRules',
              components: [
                { name: 'length', type: 'uint256', internalType: 'uint256' },
                {
                  name: 'rules',
                  type: 'tuple[16]',
                  internalType: 'struct ParamRule[16]',
                  components: [
                    {
                      name: 'condition',
                      type: 'uint8',
                      internalType: 'enum ParamCondition',
                    },
                    { name: 'offset', type: 'uint64', internalType: 'uint64' },
                    { name: 'isLimited', type: 'bool', internalType: 'bool' },
                    { name: 'ref', type: 'bytes32', internalType: 'bytes32' },
                    {
                      name: 'usage',
                      type: 'tuple',
                      internalType: 'struct LimitUsage',
                      components: [
                        {
                          name: 'limit',
                          type: 'uint256',
                          internalType: 'uint256',
                        },
                        {
                          name: 'used',
                          type: 'uint256',
                          internalType: 'uint256',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      stateMutability: 'view',
    },
  ],
  [
    {
      components: [
        {
          name: 'valueLimitPerUse',
          type: 'uint256',
        },
        {
          components: [
            {
              name: 'length',
              type: 'uint256',
            },
            {
              components: [
                {
                  name: 'condition',
                  type: 'uint8',
                },
                {
                  name: 'offset',
                  type: 'uint64',
                },
                {
                  name: 'isLimited',
                  type: 'bool',
                },
                {
                  name: 'ref',
                  type: 'bytes32',
                },
                {
                  components: [
                    {
                      name: 'limit',
                      type: 'uint256',
                    },
                    {
                      name: 'used',
                      type: 'uint256',
                    },
                  ],
                  name: 'usage',
                  type: 'tuple',
                },
              ],
              name: 'rules',
              type: 'tuple[16]',
            },
          ],
          name: 'paramRules',
          type: 'tuple',
        },
      ],
      name: 'ActionConfig',
      type: 'tuple',
    },
  ],
]
