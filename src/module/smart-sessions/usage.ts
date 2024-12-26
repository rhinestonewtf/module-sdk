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
  ERC7739Context,
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

export const getVerifySignatureResult = async ({
  client,
  account,
  sender,
  hash,
  signature,
}: {
  client: PublicClient
  account: Account
  sender: Address
  hash: Hex
  signature: Hex
}) => {
  let calldata = encodeFunctionData({
    abi,
    functionName: 'isValidSignatureWithSender',
    args: [sender, hash, signature],
  })
  const { data } = await client.call({
    account: account.address,
    to: SMART_SESSIONS_ADDRESS,
    data: calldata,
  })

  return (
    data ===
    '0x1626ba7e00000000000000000000000000000000000000000000000000000000'
  )
}

export const getAccountEIP712Domain = async ({
  client,
  account,
}: {
  client: PublicClient
  account: Account
}) => {
  let data = await client.readContract({
    address: account.address,
    abi: [
      {
        type: 'function',
        name: 'eip712Domain',
        inputs: [],
        outputs: [
          {
            type: 'bytes1',
            name: 'fields,',
          },
          {
            type: 'string',
            name: 'name',
          },
          {
            type: 'string',
            name: 'version',
          },
          {
            type: 'uint256',
            name: 'chainId',
          },
          {
            type: 'address',
            name: 'verifyingContract',
          },
          {
            type: 'bytes32',
            name: 'salt',
          },
          {
            type: 'uint256[]',
            name: 'extensions',
          },
        ],
        stateMutability: 'view',
        constant: true,
      },
    ],
    functionName: 'eip712Domain',
    args: [],
  })
  return {
    name: data[1],
    version: data[2],
    chainId: data[3],
    verifyingContract: data[4],
    salt: data[5],
  }
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
    functionName: 'isPermissionEnabled',
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
    args: [permissionId, account.address, session, Number(mode)],
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
        [mode, permissionId, signature],
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
        ['bytes1', 'bytes'],
        [
          SmartSessionMode.ENABLE,
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
      const decodedSignature = slice(signature, 33)
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
      ERC7739Context: [
        { name: 'appDomainSeparator', type: 'bytes32' },
        { name: 'contentName', type: 'string[]' },
      ],
      ERC7739Data: [
        { name: 'allowedERC7739Content', type: 'ERC7739Context[]' },
        { name: 'erc1271Policies', type: 'PolicyData[]' },
      ],
      SignedPermissions: [
        { name: 'permitGenericPolicy', type: 'bool' },
        { name: 'permitAdminAccess', type: 'bool' },
        { name: 'ignoreSecurityAttestations', type: 'bool' },
        { name: 'permitERC4337Paymaster', type: 'bool' },
        { name: 'userOpPolicies', type: 'PolicyData[]' },
        { name: 'erc7739Policies', type: 'ERC7739Data' },
        { name: 'actions', type: 'ActionData[]' },
      ],
      SignedSession: [
        { name: 'account', type: 'address' },
        { name: 'permissions', type: 'SignedPermissions' },
        { name: 'sessionValidator', type: 'address' },
        { name: 'sessionValidatorInitData', type: 'bytes' },
        { name: 'salt', type: 'bytes32' },
        { name: 'smartSession', type: 'address' },
        { name: 'nonce', type: 'uint256' },
      ],
      ChainSession: [
        { name: 'chainId', type: 'uint64' },
        { name: 'session', type: 'SignedSession' },
      ],
      MultiChainSession: [
        { name: 'sessionsAndChainIds', type: 'ChainSession[]' },
      ],
    },
    primaryType: 'MultiChainSession',
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
      return encodePacked(['address', 'bytes'], [validator, signature])
    case 'nexus':
      return encodePacked(['address', 'bytes'], [validator, signature])
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
  contents: ERC7739Context[]
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

export const getEnableSessionDetails = async ({
  sessions,
  sessionIndex,
  enableMode,
  account,
  clients,
  enableValidatorAddress,
  permitGenericPolicy = false,
  permitAdminAccess = false,
  ignoreSecurityAttestations = false,
}: {
  sessions: Session[]
  sessionIndex?: number
  enableMode?: SmartSessionModeType
  account: Account
  clients: PublicClient[]
  enableValidatorAddress?: Address
  permitGenericPolicy?: boolean
  permitAdminAccess?: boolean
  ignoreSecurityAttestations?: boolean
}) => {
  const chainDigests = []
  const chainSessions: ChainSession[] = []
  for (const session of sessions) {
    const permissionId = getPermissionId({
      session,
    })

    const client = clients.find(
      (c) => BigInt(c.chain?.id ?? 0) === session.chainId,
    )

    if (!client) {
      throw new Error(`Client not found for chainId ${session.chainId}`)
    }

    const sessionNonce = await getSessionNonce({
      client,
      account,
      permissionId,
    })

    const sessionDigest = await getSessionDigest({
      client,
      account,
      session,
      mode: enableMode || SmartSessionMode.ENABLE,
      permissionId,
    })

    chainDigests.push({
      chainId: session.chainId,
      sessionDigest,
    })

    chainSessions.push({
      chainId: session.chainId,
      session: {
        ...session,
        permissions: {
          permitGenericPolicy: permitGenericPolicy,
          permitAdminAccess: permitAdminAccess,
          ignoreSecurityAttestations: ignoreSecurityAttestations,
          permitERC4337Paymaster: session.permitERC4337Paymaster,
          userOpPolicies: session.userOpPolicies,
          erc7739Policies: session.erc7739Policies,
          actions: session.actions,
        },
        account: account.address,
        smartSession: SMART_SESSIONS_ADDRESS,
        nonce: sessionNonce,
      },
    })
  }

  const permissionEnableHash = hashChainSessions(chainSessions)

  const sessionToEnable = sessions[sessionIndex || 0]
  const permissionId = getPermissionId({
    session: sessionToEnable,
  })

  return {
    permissionEnableHash,
    mode: enableMode || SmartSessionMode.ENABLE,
    permissionId,
    signature: '0x' as Hex,
    enableSessionData: {
      enableSession: {
        chainDigestIndex: sessionIndex || 0,
        hashesAndChainIds: chainDigests,
        sessionToEnable,
        permissionEnableSig: '0x' as Hex,
      },
      validator: enableValidatorAddress ?? sessionToEnable.sessionValidator,
      accountType: account.type,
    },
  }
}
