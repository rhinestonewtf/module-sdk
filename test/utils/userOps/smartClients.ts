require('dotenv').config()
import {
  createSmartAccountClient,
  ENTRYPOINT_ADDRESS_V07,
  getAccountNonce,
  bundlerActions,
} from 'permissionless'
import {
  signerToEcdsaKernelSmartAccount,
  signerToSafeSmartAccount,
} from 'permissionless/accounts'
import {
  Address,
  createClient,
  encodePacked,
  Hex,
  http,
  pad,
  PublicClient,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { getPublicClient } from 'test/utils/userOps/clients'
import { anvil } from 'viem/chains'
import { BUNDLER_URL } from 'test/utils/userOps/constants/contracts'
import { erc7579Actions } from 'permissionless/actions/erc7579'
import { Account } from 'src/account'
import { validators } from './constants/validators'
import { pimlicoBundlerActions } from 'permissionless/actions/pimlico'

const signer = privateKeyToAccount(process.env.PRIVATE_KEY as Hex)

const publicClient = getPublicClient()

export const getBundlerClient = () =>
  createClient({
    transport: http(BUNDLER_URL),
  })
    .extend(bundlerActions(ENTRYPOINT_ADDRESS_V07))
    .extend(pimlicoBundlerActions(ENTRYPOINT_ADDRESS_V07))

// Safe Smart Client
const getSafeClient = async (account: Account) => {
  const safeAccount = await signerToSafeSmartAccount(publicClient, {
    safeVersion: '1.4.1',
    signer,
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    safe4337ModuleAddress: '0x3Fdb5BC686e861480ef99A6E3FaAe03c0b9F32e2',
    erc7579LaunchpadAddress: '0xEBe001b3D534B9B6E2500FB78E67a1A137f561CE',
    address: account.address,
  })

  return createSmartAccountClient({
    account: safeAccount,
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    chain: anvil,
    bundlerTransport: http(BUNDLER_URL),
  }).extend(erc7579Actions({ entryPoint: ENTRYPOINT_ADDRESS_V07 }))
}

// Kernel Smart Client
const getKernelClient = async (account: Account) => {
  const kernelAccount = await signerToEcdsaKernelSmartAccount(publicClient, {
    signer,
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    address: account.address,
  })

  return createSmartAccountClient({
    account: kernelAccount,
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    chain: anvil,
    bundlerTransport: http(BUNDLER_URL),
  }).extend(erc7579Actions({ entryPoint: ENTRYPOINT_ADDRESS_V07 }))
}

// Nexus Smart Client
const getNexusClient = async (account: Account) => {
  const nexusAccount = await signerToEcdsaKernelSmartAccount(publicClient, {
    signer,
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    address: account.address,
  })

  return createSmartAccountClient({
    account: nexusAccount,
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    chain: anvil,
    bundlerTransport: http(BUNDLER_URL),
  }).extend(erc7579Actions({ entryPoint: ENTRYPOINT_ADDRESS_V07 }))
}

// 7575 Reference Implementation Smart Client
const getERC7579Client = async (account: Account) => {
  const erc7579Account = await signerToSafeSmartAccount(publicClient, {
    signer,
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    address: account.address,
    safe4337ModuleAddress: '0x3Fdb5BC686e861480ef99A6E3FaAe03c0b9F32e2',
    erc7579LaunchpadAddress: '0xEBe001b3D534B9B6E2500FB78E67a1A137f561CE',
    safeVersion: '1.4.1',
  })

  return createSmartAccountClient({
    account: erc7579Account,
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    chain: anvil,
    bundlerTransport: http(BUNDLER_URL),
  }).extend(erc7579Actions({ entryPoint: ENTRYPOINT_ADDRESS_V07 }))
}

export const getSmartClient = async (account: Account) => {
  switch (account.type) {
    case 'safe':
      return getSafeClient(account)
    case 'kernel':
      return getKernelClient(account)
    case 'erc7579-implementation':
      return getERC7579Client(account)
    case 'nexus':
      return getNexusClient(account)
    default:
      throw new Error(`Unknown account type: ${account.type}`)
  }
}

export const getNonce = async ({
  publicClient,
  account,
  validator,
}: {
  publicClient: PublicClient
  account: Account
  validator?: Address
}) => {
  return await getAccountNonce(publicClient, {
    sender: account.address,
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    key:
      account.type === 'kernel'
        ? BigInt(
            pad(
              encodePacked(
                ['bytes1', 'bytes1', 'address'],
                ['0x00', '0x00', validator || validators.mock.address],
              ),
              {
                dir: 'right',
                size: 24,
              },
            ),
          )
        : BigInt(
            pad(validator || validators.mock.address, {
              dir: 'right',
              size: 24,
            }),
          ),
  })
}
