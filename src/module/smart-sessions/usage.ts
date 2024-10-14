import {
  encodePacked,
  Hex,
  PublicClient,
  hashTypedData,
  encodeAbiParameters,
  Address,
  encodeFunctionData,
  keccak256,
  slice,
  decodeAbiParameters,
} from 'viem'
import { abi, encodeEnableSessionSignatureAbi } from './abi'
import { SMART_SESSIONS_ADDRESS } from './constants'
import {
  ActionData,
  ChainSession,
  EnableSessionData,
  ERC7739Data,
  PolicyData,
  Session,
  SmartSessionMode,
  SmartSessionModeType,
} from './types'
import { LibZip } from 'solady'
import { Account, AccountType, Execution } from '../../account'

export const getPermissionId = ({ session }: { session: Session }): Hex => {
  return keccak256(
    encodeAbiParameters(
      [
        {
          type: 'address',
          name: 'sessionValidator',
        },
        {
          type: 'bytes',
          name: 'sessionValidatorInitData',
        },
        {
          type: 'bytes32',
          name: 'salt',
        },
      ],
      [
        session.sessionValidator,
        session.sessionValidatorInitData,
        session.salt,
      ],
    ),
  )
}

export const getActionId = async ({
  target,
  selector,
}: {
  target: Address
  selector: Hex
}) => {
  return keccak256(encodePacked(['address', 'bytes4'], [target, selector]))
}

export const getSessionNonce = async ({
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
    functionName: 'getNonce',
    args: [permissionId, account.address],
  })) as bigint
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
        ['bytes1', 'bytes'],
        [
          mode,
          LibZip.flzCompress(
            encodeEnableSessionSignature({ enableSessionData, signature }),
          ) as Hex,
        ],
      )
    default:
      throw new Error(`Unknown mode ${mode}`)
  }
}

export const encodeUseOrEnableSmartSessionSignature = async ({
  account,
  client,
  permissionId,
  signature,
  enableSessionData,
}: {
  account: Account
  client: PublicClient
  permissionId: Hex
  signature: Hex
  enableSessionData: EnableSessionData
}) => {
  const sessionEnabled = await isSessionEnabled({
    account,
    client,
    permissionId,
  })

  return sessionEnabled
    ? encodePacked(
        ['bytes1', 'bytes32', 'bytes'],
        [
          SmartSessionMode.USE,
          permissionId,
          LibZip.flzCompress(
            encodeAbiParameters(
              [
                {
                  type: 'bytes',
                },
              ],
              [signature],
            ),
          ) as Hex,
        ],
      )
    : encodePacked(
        ['bytes1', 'bytes32', 'bytes'],
        [
          SmartSessionMode.ENABLE,
          permissionId,
          LibZip.flzCompress(
            encodeEnableSessionSignature({ enableSessionData, signature }),
          ) as Hex,
        ],
      )
}

export const decodeSmartSessionSignature = ({
  signature,
  account,
}: {
  signature: Hex
  account?: Account
}) => {
  const mode = slice(signature, 0, 1)
  let permissionId
  let compressedData
  let data

  switch (mode) {
    case SmartSessionMode.USE:
      permissionId = slice(signature, 1, 33)
      compressedData = slice(signature, 33)
      data = LibZip.flzDecompress(compressedData) as Hex
      const decodedSignature = decodeAbiParameters(
        [
          {
            type: 'bytes',
          },
        ],
        data,
      )[0]
      return {
        mode,
        permissionId,
        signature: decodedSignature,
      }
    case SmartSessionMode.ENABLE:
    case SmartSessionMode.UNSAFE_ENABLE:
      compressedData = slice(signature, 1)
      data = LibZip.flzDecompress(compressedData) as Hex

      if (!account) {
        throw new Error('account is required for ENABLE mode decoding')
      }

      const decodedData = decodeAbiParameters(
        encodeEnableSessionSignatureAbi,
        data,
      )
      const enableSession = decodedData[0]

      const permissionEnableSigSlice = account.type === 'kernel' ? 1 : 0
      if (
        account.type === 'kernel' &&
        !enableSession.permissionEnableSig.startsWith('0x01')
      ) {
        throw new Error('Invalid permissionEnableSig for kernel account')
      }
      const permissionEnableSig = slice(
        enableSession.permissionEnableSig,
        20 + permissionEnableSigSlice,
      )
      const validator = slice(
        enableSession.permissionEnableSig,
        0 + permissionEnableSigSlice,
        20 + permissionEnableSigSlice,
      )
      return {
        mode: mode,
        permissionId: keccak256(
          encodeAbiParameters(
            [
              {
                type: 'address',
                name: 'sessionValidator',
              },
              {
                type: 'bytes',
                name: 'sessionValidatorInitData',
              },
              {
                type: 'bytes32',
                name: 'salt',
              },
            ],
            [
              enableSession.sessionToEnable.sessionValidator,
              enableSession.sessionToEnable.sessionValidatorInitData,
              enableSession.sessionToEnable.salt,
            ],
          ),
        ),
        signature: decodedData[1],
        enableSessionData: {
          enableSession: {
            chainDigestIndex: enableSession.chainDigestIndex,
            hashesAndChainIds: enableSession.hashesAndChainIds,
            sessionToEnable: enableSession.sessionToEnable,
            permissionEnableSig: permissionEnableSig,
          },
          validator: validator,
          accountType: account.type,
        } as EnableSessionData,
      }
    default:
      throw new Error(`Unknown mode ${mode}`)
  }
}

export const hashChainSessions = (chainSessions: ChainSession[]): Hex => {
  return hashTypedData({
    domain: {
      name: 'SmartSession',
      version: '1',
    },
    types: {
      PolicyData: [
        { name: 'policy', type: 'address' },
        { name: 'initData', type: 'bytes' },
      ],
      ActionData: [
        { name: 'actionTargetSelector', type: 'bytes4' },
        { name: 'actionTarget', type: 'address' },
        { name: 'actionPolicies', type: 'PolicyData[]' },
      ],
      ERC7739Data: [
        { name: 'allowedERC7739Content', type: 'string[]' },
        { name: 'erc1271Policies', type: 'PolicyData[]' },
      ],
      SessionEIP712: [
        { name: 'account', type: 'address' },
        { name: 'smartSession', type: 'address' },
        { name: 'mode', type: 'uint8' },
        { name: 'sessionValidator', type: 'address' },
        { name: 'salt', type: 'bytes32' },
        { name: 'sessionValidatorInitData', type: 'bytes' },
        { name: 'userOpPolicies', type: 'PolicyData[]' },
        { name: 'erc7739Policies', type: 'ERC7739Data' },
        { name: 'actions', type: 'ActionData[]' },
        { name: 'nonce', type: 'uint256' },
      ],
      ChainSessionEIP712: [
        { name: 'chainId', type: 'uint64' },
        { name: 'session', type: 'SessionEIP712' },
      ],
      MultiChainSessionEIP712: [
        { name: 'sessionsAndChainIds', type: 'ChainSessionEIP712[]' },
      ],
    },
    primaryType: 'MultiChainSessionEIP712',
    message: {
      sessionsAndChainIds: chainSessions,
    },
  })
}

const encodeEnableSessionSignature = ({
  enableSessionData,
  signature,
}: {
  enableSessionData: EnableSessionData
  signature: Hex
}) => {
  return encodeAbiParameters(encodeEnableSessionSignatureAbi, [
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
  ])
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

export const getEnableSessionsAction = ({
  sessions,
}: {
  sessions: Session[]
}): Execution => {
  const data = encodeFunctionData({
    abi,
    functionName: 'enableSessions',
    args: [sessions],
  })

  return {
    to: SMART_SESSIONS_ADDRESS,
    target: SMART_SESSIONS_ADDRESS,
    value: BigInt(0),
    callData: data,
    data,
  }
}

export const getRemoveSessionAction = ({
  permissionId,
}: {
  permissionId: Hex
}): Execution => {
  const data = encodeFunctionData({
    abi,
    functionName: 'removeSession',
    args: [permissionId],
  })

  return {
    to: SMART_SESSIONS_ADDRESS,
    target: SMART_SESSIONS_ADDRESS,
    value: BigInt(0),
    callData: data,
    data,
  }
}

export const getEnableUserOpPoliciesAction = ({
  permissionId,
  userOpPolicies,
}: {
  permissionId: Hex
  userOpPolicies: PolicyData[]
}): Execution => {
  const data = encodeFunctionData({
    abi,
    functionName: 'enableUserOpPolicies',
    args: [permissionId, userOpPolicies],
  })

  return {
    to: SMART_SESSIONS_ADDRESS,
    target: SMART_SESSIONS_ADDRESS,
    value: BigInt(0),
    callData: data,
    data,
  }
}

export const getDisableUserOpPoliciesAction = ({
  permissionId,
  userOpPolicies,
}: {
  permissionId: Hex
  userOpPolicies: Address[]
}): Execution => {
  const data = encodeFunctionData({
    abi,
    functionName: 'disableUserOpPolicies',
    args: [permissionId, userOpPolicies],
  })

  return {
    to: SMART_SESSIONS_ADDRESS,
    target: SMART_SESSIONS_ADDRESS,
    value: BigInt(0),
    callData: data,
    data,
  }
}

export const getEnableERC1271PoliciesAction = ({
  permissionId,
  erc1271Policies,
}: {
  permissionId: Hex
  erc1271Policies: ERC7739Data
}): Execution => {
  const data = encodeFunctionData({
    abi,
    functionName: 'enableERC1271Policies',
    args: [permissionId, erc1271Policies],
  })

  return {
    to: SMART_SESSIONS_ADDRESS,
    target: SMART_SESSIONS_ADDRESS,
    value: BigInt(0),
    callData: data,
    data,
  }
}

export const getDisableERC1271PoliciesAction = ({
  permissionId,
  policies,
  contents,
}: {
  permissionId: Hex
  policies: Address[]
  contents: string[]
}): Execution => {
  const data = encodeFunctionData({
    abi,
    functionName: 'disableERC1271Policies',
    args: [permissionId, policies, contents],
  })

  return {
    to: SMART_SESSIONS_ADDRESS,
    target: SMART_SESSIONS_ADDRESS,
    value: BigInt(0),
    callData: data,
    data,
  }
}

export const getEnableActionPoliciesAction = ({
  permissionId,
  actionPolicies,
}: {
  permissionId: Hex
  actionPolicies: ActionData[]
}): Execution => {
  const data = encodeFunctionData({
    abi,
    functionName: 'enableActionPolicies',
    args: [permissionId, actionPolicies],
  })

  return {
    to: SMART_SESSIONS_ADDRESS,
    target: SMART_SESSIONS_ADDRESS,
    value: BigInt(0),
    callData: data,
    data,
  }
}

export const getDisableActionPoliciesAction = ({
  permissionId,
  actionId,
  policies,
}: {
  permissionId: Hex
  actionId: Hex
  policies: Address[]
}): Execution => {
  const data = encodeFunctionData({
    abi,
    functionName: 'disableActionPolicies',
    args: [permissionId, actionId, policies],
  })

  return {
    to: SMART_SESSIONS_ADDRESS,
    target: SMART_SESSIONS_ADDRESS,
    value: BigInt(0),
    callData: data,
    data,
  }
}

// todo: make session an array
export const getSessionDetails = async ({
  session,
  chainId,
  mode,
  account,
  client,
}: {
  session: Session
  chainId: bigint
  mode: SmartSessionModeType
  account: Account
  client: PublicClient
}) => {
  const permissionId = getPermissionId({
    session,
  })

  const sessionNonce = await getSessionNonce({
    client,
    account,
    permissionId,
  })

  const sessionDigest = await getSessionDigest({
    client,
    account,
    session,
    mode,
    permissionId,
  })

  const chainDigests = [
    {
      chainId: chainId,
      sessionDigest,
    },
  ]

  const chainSessions: ChainSession[] = [
    {
      chainId: chainId,
      session: {
        ...session,
        account: account.address,
        smartSession: SMART_SESSIONS_ADDRESS,
        mode,
        nonce: sessionNonce,
      },
    },
  ]

  const permissionEnableHash = hashChainSessions(chainSessions)

  return {
    permissionEnableHash,
    mode,
    permissionId,
    signature: '0x' as Hex,
    enableSessionData: {
      enableSession: {
        chainDigestIndex: 0,
        hashesAndChainIds: chainDigests,
        sessionToEnable: session,
        permissionEnableSig: '0x' as Hex,
      },
      validator: session.sessionValidator,
      accountType: account.type,
    },
  }
}
