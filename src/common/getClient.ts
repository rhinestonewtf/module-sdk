import { PublicClient, createPublicClient, http } from 'viem'

export const getClient = ({ rpcUrl }: { rpcUrl: string }): PublicClient => {
  return createPublicClient({
    transport: http(rpcUrl),
  })
}
