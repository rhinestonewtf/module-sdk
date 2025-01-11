import { AccountType } from '../../account'
import { Address, Hex } from 'viem'

export type Session = {
  sessionValidator: Address
  sessionValidatorInitData: Hex
  // todo: make this optional with default 0
  salt: Hex
  // todo: make the below optional but require one of them to be defined
  userOpPolicies: PolicyData[]
  erc7739Policies: ERC7739Data
  actions: ActionData[]
  permitERC4337Paymaster: boolean
  chainId: bigint
}

export type SignedPermissions = {
  permitGenericPolicy: boolean
  permitAdminAccess: boolean
  ignoreSecurityAttestations: boolean
  permitERC4337Paymaster: boolean
  userOpPolicies: PolicyData[]
  erc7739Policies: ERC7739Data
  actions: ActionData[]
}

export type SignedSession = {
  account: Address
  permissions: SignedPermissions
  sessionValidator: Address
  sessionValidatorInitData: Hex
  salt: Hex
  smartSession: Address
  nonce: bigint
}

export type PolicyData = {
  policy: Address
  initData: Hex
}

export type ERC7739Data = {
  allowedERC7739Content: ERC7739Context[]
  erc1271Policies: PolicyData[]
}

export type ERC7739Context = {
  appDomainSeparator: Hex
  contentName: string[]
}

export type ActionData = {
  actionTargetSelector: Hex
  actionTarget: Address
  actionPolicies: PolicyData[]
}

export const SmartSessionMode = {
  USE: '0x00' as Hex,
  ENABLE: '0x01' as Hex,
  UNSAFE_ENABLE: '0x02' as Hex,
} as const

export type SmartSessionModeType =
  (typeof SmartSessionMode)[keyof typeof SmartSessionMode]

export type EnableSession = {
  chainDigestIndex: number
  hashesAndChainIds: ChainDigest[]
  sessionToEnable: Session
  permissionEnableSig: Hex
}

export type EnableSessionData = {
  enableSession: EnableSession
  validator: Address
  accountType: AccountType
}

export type ChainDigest = {
  chainId: bigint
  sessionDigest: Hex
}

export type ChainSession = {
  chainId: bigint
  session: SignedSession
}
