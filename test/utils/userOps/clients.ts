import { http, createPublicClient, createTestClient } from 'viem'
import {
  bundlerActions,
  createBundlerClient,
  ENTRYPOINT_ADDRESS_V07,
} from 'permissionless'
import { pimlicoBundlerActions } from 'permissionless/actions/pimlico'
import { foundry } from 'viem/chains'
import { BUNDLER_URL, RPC_URL } from './constants/contracts'

export const getBundlerClient = () =>
  createBundlerClient({
    chain: foundry,
    transport: http(BUNDLER_URL),
    entryPoint: ENTRYPOINT_ADDRESS_V07,
  })
    .extend(bundlerActions(ENTRYPOINT_ADDRESS_V07))
    .extend(pimlicoBundlerActions(ENTRYPOINT_ADDRESS_V07))

export const getPublicClient = () => {
  return createPublicClient({
    transport: http(RPC_URL),
    chain: foundry,
  })
}

export const getTestClient = () =>
  createTestClient({
    mode: 'anvil',
    transport: http(RPC_URL),
  })
