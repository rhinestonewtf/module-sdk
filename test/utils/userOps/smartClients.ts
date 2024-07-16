import {
  createSmartAccountClient,
  ENTRYPOINT_ADDRESS_V07,
  getAccountNonce,
} from 'permissionless'
import {
  signerToEcdsaKernelSmartAccount,
  signerToSafeSmartAccount,
} from 'permissionless/accounts'
import { encodePacked, Hex, http, pad, PublicClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { getPublicClient } from 'test/utils/userOps/clients'
import { anvil } from 'viem/chains'
import { BUNDLER_URL } from 'test/utils/userOps/constants/contracts'
import { erc7579Actions } from 'permissionless/actions/erc7579'
import { Account } from 'src/account'

const signer = privateKeyToAccount(
  '0xf05ce3d1852f788211abf3cb37a29873ce48b57699673443910140cdf61f545f' as Hex,
)

const publicClient = getPublicClient()

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

export const getSmartClient = (account: Account) => {
  switch (account.type) {
    case 'safe':
      return getSafeClient(account)
    case 'kernel':
      return getKernelClient(account)
    case 'erc7579-implementation':
      return getERC7579Client(account)
    default:
      throw new Error(`Unknown account type: ${account.type}`)
  }
}

export const getNonce = async ({
  publicClient,
  account,
}: {
  publicClient: PublicClient
  account: Account
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
                ['0x00', '0x00', '0x503b54Ed1E62365F0c9e4caF1479623b08acbe77'],
              ),
              {
                dir: 'right',
                size: 24,
              },
            ),
          )
        : BigInt(
            pad('0x503b54Ed1E62365F0c9e4caF1479623b08acbe77', {
              dir: 'right',
              size: 24,
            }),
          ),
  })
}
