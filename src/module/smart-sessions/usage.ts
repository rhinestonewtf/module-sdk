import {
  encodePacked,
  Hex,
  PublicClient,
  hashTypedData,
  zeroAddress,
  encodeAbiParameters,
  Address,
  encodeFunctionData,
} from 'viem'
import { abi } from './abi'
import { SMART_SESSIONS_ADDRESS } from './constants'
import {
  ChainDigest,
  EnableSessionData,
  Session,
  SmartSessionMode,
  SmartSessionModeType,
} from './types'
import { LibZip } from 'solady'
import { Account, AccountType, Execution } from 'src/account'

export const getPermissionId = async ({
  client,
  session,
}: {
  client: PublicClient
  session: Session
}) => {
  return (await client.readContract({
    address: SMART_SESSIONS_ADDRESS,
    abi,
    functionName: 'getPermissionId',
    args: [session],
  })) as string
}

export const isSessionEnabled = async ({
  client,
  account,
  permissionId,
}: {
  client: PublicClient
  account: Account
  permissionId: Hex
}) => {
  return (await client.readContract({
    address: SMART_SESSIONS_ADDRESS,
    abi,
    functionName: 'isSessionEnabled',
    args: [permissionId, account.address],
  })) as boolean
}

export const getSessionDigest = async ({
  client,
  account,
  session,
  permissionId,
  mode,
}: {
  client: PublicClient
  account: Account
  session: Session
  permissionId: Hex
  mode: SmartSessionModeType
}) => {
  return (await client.readContract({
    address: SMART_SESSIONS_ADDRESS,
    abi,
    functionName: 'getSessionDigest',
    args: [permissionId, account.address, session, mode],
  })) as Hex
}

export const encodeSmartSessionSignature = ({
  mode,
  permissionId,
  signature,
  enableSessionData,
}: {
  mode: SmartSessionModeType
  permissionId: Hex
  signature: Hex
  enableSessionData?: EnableSessionData
}) => {
  switch (mode) {
    case SmartSessionMode.USE:
      return encodePacked(
        ['bytes1', 'bytes32', 'bytes'],
        [
          mode,
          permissionId,
          LibZip.flzCompress(
            encodeAbiParameters(
              [
                {
                  type: 'bytes',
                  name: 'signature',
                },
              ],
              [signature],
            ),
          ) as Hex,
        ],
      )
    case SmartSessionMode.ENABLE:
    case SmartSessionMode.UNSAFE_ENABLE:
      if (!enableSessionData) {
        throw new Error('enableSession is required for ENABLE mode')
      }

      return encodePacked(
        ['bytes1', 'bytes32', 'bytes'],
        [
          mode,
          permissionId,
          LibZip.flzCompress(
            encodeEnableSessionSignature({ enableSessionData, signature }),
          ) as Hex,
        ],
      )
    default:
      throw new Error(`Unknown mode ${mode}`)
  }
}

export const hashChainDigests = (chainDigests: ChainDigest[]): Hex => {
  return hashTypedData({
    domain: {
      name: 'SmartSession',
      version: '',
      chainId: 0,
      verifyingContract: zeroAddress,
    },
    types: {
      ChainDigest: [
        { name: 'chainId', type: 'uint64' },
        { name: 'sessionDigest', type: 'bytes32' },
      ],
      ChainDigests: [{ name: 'chainDigests', type: 'ChainDigest[]' }],
    },
    primaryType: 'ChainDigests',
    message: {
      chainDigests,
    },
  })
}

export const encodeEnableSessionSignature = ({
  enableSessionData,
  signature,
}: {
  enableSessionData: EnableSessionData
  signature: Hex
}) => {
  return encodeAbiParameters(
    [
      {
        components: [
          {
            type: 'uint8',
            name: 'chainDigestIndex',
          },
          {
            type: 'tuple[]',
            components: [
              {
                internalType: 'uint64',
                name: 'chainId',
                type: 'uint64',
              },
              {
                internalType: 'bytes32',
                name: 'sessionDigest',
                type: 'bytes32',
              },
            ],
            name: 'hashesAndChainIds',
          },
          {
            components: [
              {
                internalType: 'contract ISessionValidator',
                name: 'sessionValidator',
                type: 'address',
              },
              {
                internalType: 'bytes',
                name: 'sessionValidatorInitData',
                type: 'bytes',
              },
              { internalType: 'bytes32', name: 'salt', type: 'bytes32' },
              {
                components: [
                  { internalType: 'address', name: 'policy', type: 'address' },
                  { internalType: 'bytes', name: 'initData', type: 'bytes' },
                ],
                internalType: 'struct PolicyData[]',
                name: 'userOpPolicies',
                type: 'tuple[]',
              },
              {
                components: [
                  {
                    internalType: 'string[]',
                    name: 'allowedERC7739Content',
                    type: 'string[]',
                  },
                  {
                    components: [
                      {
                        internalType: 'address',
                        name: 'policy',
                        type: 'address',
                      },
                      {
                        internalType: 'bytes',
                        name: 'initData',
                        type: 'bytes',
                      },
                    ],
                    internalType: 'struct PolicyData[]',
                    name: 'erc1271Policies',
                    type: 'tuple[]',
                  },
                ],
                internalType: 'struct ERC7739Data',
                name: 'erc7739Policies',
                type: 'tuple',
              },
              {
                components: [
                  {
                    internalType: 'bytes4',
                    name: 'actionTargetSelector',
                    type: 'bytes4',
                  },
                  {
                    internalType: 'address',
                    name: 'actionTarget',
                    type: 'address',
                  },
                  {
                    components: [
                      {
                        internalType: 'address',
                        name: 'policy',
                        type: 'address',
                      },
                      {
                        internalType: 'bytes',
                        name: 'initData',
                        type: 'bytes',
                      },
                    ],
                    internalType: 'struct PolicyData[]',
                    name: 'actionPolicies',
                    type: 'tuple[]',
                  },
                ],
                internalType: 'struct ActionData[]',
                name: 'actions',
                type: 'tuple[]',
              },
            ],
            internalType: 'struct Session',
            name: 'sessionToEnable',
            type: 'tuple',
          },
          {
            type: 'bytes',
            name: 'permissionEnableSig',
          },
        ],
        internalType: 'struct EnableSession',
        name: 'enableSession',
        type: 'tuple',
      },
      { type: 'bytes' },
    ],
    [
      {
        chainDigestIndex: enableSessionData.enableSession.chainDigestIndex,
        hashesAndChainIds: enableSessionData.enableSession.hashesAndChainIds,
        sessionToEnable: enableSessionData.enableSession.sessionToEnable,
        permissionEnableSig: formatPermissionEnableSig({
          signature: enableSessionData.enableSession.permissionEnableSig,
          validator: enableSessionData.validator,
          accountType: enableSessionData.accountType,
        }),
      },
      signature,
    ],
  )
}

export const formatPermissionEnableSig = ({
  signature,
  validator,
  accountType,
}: {
  signature: Hex
  validator: Address
  accountType: AccountType
}) => {
  switch (accountType) {
    case 'erc7579-implementation':
    case 'nexus':
    case 'safe':
      return encodePacked(['address', 'bytes'], [validator, signature])
    case 'kernel':
      return encodePacked(
        ['bytes1', 'address', 'bytes'],
        ['0x01', validator, signature],
      )
    default:
      throw new Error(`Unsupported account type: ${accountType}`)
  }
}

export const getRemoveSessionAction = ({
  permissionId,
}: {
  permissionId: Hex
}): Execution => {
  return {
    target: SMART_SESSIONS_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      abi,
      functionName: 'removeSession',
      args: [permissionId],
    }),
  }
}

// USE Flow
// 1. getPermissionId(session)
// 2. sign UserOp
// 3. encodeSmartSessionSignature(mode, permissionId, signature)
// 4. Update signature in UserOp
// 5. send UserOp

// ENABLE Flow
// 1. getPermissionId(session)
// 2. getSessionDigest(session, permissionId, mode)
// 3. hashChainDigests(chainDigests)
// 4. sign chain digests hash
// 5. sign UserOp
// 6. encodeEnableSessionSignature(mode, permissionId, signature, enableSessionData)
// 7. Update signature in UserOp
// 8. send UserOp
