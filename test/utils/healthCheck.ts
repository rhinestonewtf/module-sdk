import { createBundlerClient, ENTRYPOINT_ADDRESS_V07 } from 'permissionless'
import { http } from 'viem'
import { foundry } from 'viem/chains'

export const ensureBundlerIsReady = async () => {
  const bundlerClient = createBundlerClient({
    chain: foundry,
    transport: http('http://localhost:4337'),
    entryPoint: ENTRYPOINT_ADDRESS_V07,
  })

  while (true) {
    try {
      await bundlerClient.chainId()
      return
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }
}
