import { AccountType } from 'src/account'
import { Address, Hex } from 'viem'

export type Session = {
  sessionValidator: Address
  sessionValidatorInitData: Hex
  salt: Hex
  userOpPolicies: PolicyData[]
  erc7739Policies: ERC7739Data
  actions: ActionData[]
}

export type SessionEIP712 = {
  account: Address
  smartSession: Address
  mode: number
  nonce: bigint
  sessionValidator: Address
  sessionValidatorInitData: Hex
  salt: Hex
  userOpPolicies: PolicyData[]
  erc7739Policies: ERC7739Data
  actions: ActionData[]
}

export type PolicyData = {
  policy: Address
  initData: Hex
}

export type ERC7739Data = {
  allowedERC7739Content: string[]
  erc1271Policies: PolicyData[]
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
  session: SessionEIP712
}
