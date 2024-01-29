import { createPublicClient, http } from 'viem'

export const getClient = ({ rpcUrl }: { rpcUrl: string }) => {
  return createPublicClient({
    transport: http(rpcUrl),
  })
}
