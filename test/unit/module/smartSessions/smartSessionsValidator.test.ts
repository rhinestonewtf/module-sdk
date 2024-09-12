import {
  keccak256,
  toBytes,
  toHex,
  zeroAddress,
  createWalletClient,
  http,
  Address,
  Hex,
  getAddress,
} from 'viem'
import { Session, SmartSessionMode } from 'src/module/smart-sessions/types'
import {
  decodeSmartSessionSignature,
  encodeSmartSessionSignature,
  getSessionDigest,
  getSmartSessionsValidator,
  getSudoPolicy,
  SMART_SESSIONS_ADDRESS,
} from 'src/module/smart-sessions'
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts'
import { mainnet } from 'viem/chains'
import { getPublicClient } from 'test/utils/userOps/clients'
import {
  encodeValidationData,
  getOwnableValidatorMockSignature,
  OWNABLE_VALIDATOR_ADDRESS,
} from 'src/module'
import { getAccount } from 'src/account'

describe('Smart Sessions Polices', () => {
  it('should get install smart sessions', async () => {
    const sessions: Session[] = [
      {
        sessionValidator: zeroAddress,
        sessionValidatorInitData: '0x',
        salt: toHex(toBytes(1, { size: 32 })),
        userOpPolicies: [],
        actions: [],
        erc7739Policies: {
          allowedERC7739Content: [],
          erc1271Policies: [],
        },
      },
    ]

    const installSmartSession = getSmartSessionsValidator({ sessions })
    expect(installSmartSession.module).toEqual(SMART_SESSIONS_ADDRESS)
    expect(installSmartSession.initData).toBeDefined()
    expect(installSmartSession.deInitData).toEqual('0x')
  })

  it('should correctly encode and decode the session signature in use mode', async () => {
    const permissionId = keccak256(toHex('permissionId'))
    const signature = getOwnableValidatorMockSignature()

    const encodedSig = encodeSmartSessionSignature({
      mode: SmartSessionMode.USE,
      permissionId,
      signature,
    })

    const decodedSig = decodeSmartSessionSignature({
      signature: encodedSig,
    })

    expect(decodedSig.mode).toEqual(SmartSessionMode.USE)
    expect(decodedSig.permissionId).toEqual(permissionId)
    expect(decodedSig.signature).toEqual(signature)
  })

  it('should correctly encode and decode the session signature in enable mode', async () => {
    const permissionId = keccak256(toHex('permissionId'))
    const sigHash = keccak256(toHex('sigHash'))
    const permissionEnableHash = keccak256(toHex('permissionEnableHash'))

    const privateKey = generatePrivateKey()
    const signer = privateKeyToAccount(privateKey)

    const client = createWalletClient({
      account: signer,
      chain: mainnet,
      transport: http(),
    })

    const signature = await client.signMessage({
      message: { raw: sigHash },
    })

    const permissionEnableSig = await signer.signMessage({
      message: { raw: permissionEnableHash },
    })

    const account = getAccount({
      address: '0x7227dcfb0c5ec7a5f539f97b18be261c49687ed6',
      type: 'erc7579-implementation',
    })

    const session: Session = {
      sessionValidator: OWNABLE_VALIDATOR_ADDRESS as Address,
      sessionValidatorInitData: encodeValidationData({
        threshold: 1,
        owners: [privateKeyToAccount(privateKey).address],
      }),
      salt: toHex(toBytes('1', { size: 32 })),
      userOpPolicies: [],
      actions: [
        {
          actionTarget: getAddress(account.address),
          actionTargetSelector: '0x9cfd7cff' as Hex,
          actionPolicies: [
            {
              policy: getAddress(getSudoPolicy().address),
              initData: getSudoPolicy().initData,
            },
          ],
        },
      ],
      erc7739Policies: {
        allowedERC7739Content: [],
        erc1271Policies: [],
      },
    }

    const sessionDigest = keccak256(toHex('sessionDigest'))

    const chainDigests = [
      {
        chainId: BigInt(mainnet.id),
        sessionDigest,
      },
    ]

    const encodedSig = encodeSmartSessionSignature({
      mode: SmartSessionMode.ENABLE,
      permissionId,
      signature,
      enableSessionData: {
        enableSession: {
          chainDigestIndex: 0,
          hashesAndChainIds: chainDigests,
          sessionToEnable: session,
          permissionEnableSig,
        },
        validator: OWNABLE_VALIDATOR_ADDRESS,
        accountType: account.type,
      },
    })

    const decodedSig = decodeSmartSessionSignature({
      signature: encodedSig,
      account,
    })

    expect(decodedSig.mode).toEqual(SmartSessionMode.ENABLE)
    expect(decodedSig.permissionId).toEqual(permissionId)
    expect(decodedSig.signature).toEqual(signature)
    expect(
      decodedSig.enableSessionData?.enableSession.chainDigestIndex,
    ).toEqual(0)
    expect(
      decodedSig.enableSessionData?.enableSession.hashesAndChainIds,
    ).toEqual(chainDigests)
    expect(decodedSig.enableSessionData?.enableSession.sessionToEnable).toEqual(
      session,
    )
    expect(
      decodedSig.enableSessionData?.enableSession.permissionEnableSig,
    ).toEqual(permissionEnableSig)
    expect(keccak256(decodedSig.enableSessionData?.validator!)).toEqual(
      keccak256(OWNABLE_VALIDATOR_ADDRESS),
    )
    expect(decodedSig.enableSessionData?.accountType).toEqual(account.type)
  })

  it('should correctly encode and decode the session signature in enable mode for kernel', async () => {
    const permissionId = keccak256(toHex('permissionId'))
    const sigHash = keccak256(toHex('sigHash'))
    const permissionEnableHash = keccak256(toHex('permissionEnableHash'))

    const privateKey = generatePrivateKey()
    const signer = privateKeyToAccount(privateKey)

    const client = createWalletClient({
      account: signer,
      chain: mainnet,
      transport: http(),
    })

    const signature = await client.signMessage({
      message: { raw: sigHash },
    })

    const permissionEnableSig = await signer.signMessage({
      message: { raw: permissionEnableHash },
    })

    const account = getAccount({
      address: '0x7227dcfb0c5ec7a5f539f97b18be261c49687ed6',
      type: 'kernel',
    })

    const session: Session = {
      sessionValidator: OWNABLE_VALIDATOR_ADDRESS as Address,
      sessionValidatorInitData: encodeValidationData({
        threshold: 1,
        owners: [privateKeyToAccount(privateKey).address],
      }),
      salt: toHex(toBytes('1', { size: 32 })),
      userOpPolicies: [],
      actions: [
        {
          actionTarget: getAddress(account.address),
          actionTargetSelector: '0x9cfd7cff' as Hex,
          actionPolicies: [
            {
              policy: getAddress(getSudoPolicy().address),
              initData: getSudoPolicy().initData,
            },
          ],
        },
      ],
      erc7739Policies: {
        allowedERC7739Content: [],
        erc1271Policies: [],
      },
    }

    const sessionDigest = keccak256(toHex('sessionDigest'))

    const chainDigests = [
      {
        chainId: BigInt(mainnet.id),
        sessionDigest,
      },
    ]

    const encodedSig = encodeSmartSessionSignature({
      mode: SmartSessionMode.ENABLE,
      permissionId,
      signature,
      enableSessionData: {
        enableSession: {
          chainDigestIndex: 0,
          hashesAndChainIds: chainDigests,
          sessionToEnable: session,
          permissionEnableSig,
        },
        validator: OWNABLE_VALIDATOR_ADDRESS,
        accountType: account.type,
      },
    })

    const decodedSig = decodeSmartSessionSignature({
      signature: encodedSig,
      account,
    })

    expect(decodedSig.mode).toEqual(SmartSessionMode.ENABLE)
    expect(decodedSig.permissionId).toEqual(permissionId)
    expect(decodedSig.signature).toEqual(signature)
    expect(
      decodedSig.enableSessionData?.enableSession.chainDigestIndex,
    ).toEqual(0)
    expect(
      decodedSig.enableSessionData?.enableSession.hashesAndChainIds,
    ).toEqual(chainDigests)
    expect(decodedSig.enableSessionData?.enableSession.sessionToEnable).toEqual(
      session,
    )
    expect(
      decodedSig.enableSessionData?.enableSession.permissionEnableSig,
    ).toEqual(permissionEnableSig)
    expect(keccak256(decodedSig.enableSessionData?.validator!)).toEqual(
      keccak256(OWNABLE_VALIDATOR_ADDRESS),
    )
    expect(decodedSig.enableSessionData?.accountType).toEqual(account.type)
  })

  it('should throw error when decoding the session signature in enable mode with incorrect account', async () => {
    const permissionId = keccak256(toHex('permissionId'))
    const sigHash = keccak256(toHex('sigHash'))
    const permissionEnableHash = keccak256(toHex('permissionEnableHash'))

    const privateKey = generatePrivateKey()
    const signer = privateKeyToAccount(privateKey)

    const client = createWalletClient({
      account: signer,
      chain: mainnet,
      transport: http(),
    })

    const signature = await client.signMessage({
      message: { raw: sigHash },
    })

    const permissionEnableSig = await signer.signMessage({
      message: { raw: permissionEnableHash },
    })

    const account = getAccount({
      address: '0x7227dcfb0c5ec7a5f539f97b18be261c49687ed6',
      type: 'erc7579-implementation',
    })

    const session: Session = {
      sessionValidator: OWNABLE_VALIDATOR_ADDRESS as Address,
      sessionValidatorInitData: encodeValidationData({
        threshold: 1,
        owners: [privateKeyToAccount(privateKey).address],
      }),
      salt: toHex(toBytes('1', { size: 32 })),
      userOpPolicies: [],
      actions: [
        {
          actionTarget: getAddress(account.address),
          actionTargetSelector: '0x9cfd7cff' as Hex,
          actionPolicies: [
            {
              policy: getAddress(getSudoPolicy().address),
              initData: getSudoPolicy().initData,
            },
          ],
        },
      ],
      erc7739Policies: {
        allowedERC7739Content: [],
        erc1271Policies: [],
      },
    }

    const sessionDigest = keccak256(toHex('sessionDigest'))

    const chainDigests = [
      {
        chainId: BigInt(mainnet.id),
        sessionDigest,
      },
    ]

    const encodedSig = encodeSmartSessionSignature({
      mode: SmartSessionMode.ENABLE,
      permissionId,
      signature,
      enableSessionData: {
        enableSession: {
          chainDigestIndex: 0,
          hashesAndChainIds: chainDigests,
          sessionToEnable: session,
          permissionEnableSig,
        },
        validator: OWNABLE_VALIDATOR_ADDRESS,
        accountType: account.type,
      },
    })

    const wrongAccount = getAccount({
      address: '0x7227dcfb0c5ec7a5f539f97b18be261c49687ed6',
      type: 'kernel',
    }) 
    
    expect(() => decodeSmartSessionSignature({
      signature: encodedSig,
      account: wrongAccount,
    })).toThrow('Invalid permissionEnableSig for kernel account');

  })

})
