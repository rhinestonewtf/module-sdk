import {
  encodePacked,
  Hex,
  PublicClient,
  hashTypedData,
  zeroAddress,
  encodeAbiParameters,
  Address,
  encodeFunctionData,
  keccak256,
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

export const encodeUseSmartSessionSignature = ({
  permissionId,
  signature,
}: {
  permissionId: Hex
  signature: Hex
}) => {
  return encodePacked(
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
}

export const encodeEnableSmartSessionSignature = ({
  permissionId,
  signature,
  enableSessionData,
}: {
  permissionId: Hex
  signature: Hex
  enableSessionData: EnableSessionData
}) => {
  return encodePacked(
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
  return {
    target: SMART_SESSIONS_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      abi,
      functionName: 'enableSessions',
      args: [sessions],
    }),
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

export const getEnableUserOpPoliciesAction = ({
  permissionId,
  userOpPolicies,
}: {
  permissionId: Hex
  userOpPolicies: PolicyData[]
}): Execution => {
  return {
    target: SMART_SESSIONS_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      abi,
      functionName: 'enableUserOpPolicies',
      args: [permissionId, userOpPolicies],
    }),
  }
}

export const getDisableUserOpPoliciesAction = ({
  permissionId,
  userOpPolicies,
}: {
  permissionId: Hex
  userOpPolicies: Address[]
}): Execution => {
  return {
    target: SMART_SESSIONS_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      abi,
      functionName: 'disableUserOpPolicies',
      args: [permissionId, userOpPolicies],
    }),
  }
}

export const getEnableERC1271PoliciesAction = ({
  permissionId,
  erc1271Policies,
}: {
  permissionId: Hex
  erc1271Policies: ERC7739Data
}): Execution => {
  return {
    target: SMART_SESSIONS_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      abi,
      functionName: 'enableERC1271Policies',
      args: [permissionId, erc1271Policies],
    }),
  }
}

export const getDisableERC1271PoliciesAction = ({
  permissionId,
  policies,
}: {
  permissionId: Hex
  policies: Address[]
}): Execution => {
  return {
    target: SMART_SESSIONS_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      abi,
      functionName: 'disableERC1271Policies',
      args: [permissionId, policies],
    }),
  }
}

export const getEnableActionPolicies = ({
  permissionId,
  actionPolicies,
}: {
  permissionId: Hex
  actionPolicies: ActionData[]
}): Execution => {
  return {
    target: SMART_SESSIONS_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      abi,
      functionName: 'enableActionPolicies',
      args: [permissionId, actionPolicies],
    }),
  }
}

export const getDisableActionPolicies = ({
  permissionId,
  actionId,
  policies,
}: {
  permissionId: Hex
  actionId: Hex
  policies: Address[]
}): Execution => {
  return {
    target: SMART_SESSIONS_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      abi,
      functionName: 'disableActionPolicies',
      args: [permissionId, actionId, policies],
    }),
  }
}
