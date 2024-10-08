import { Address, PublicClient } from 'viem'

export const isContract = async ({
  client,
  address,
}: {
  client: PublicClient
  address: Address
}) => {
  // todo: upgrade from getBytecode
  const bytecode = await client.getBytecode({
    address: address,
  })
  return bytecode && bytecode !== '0x'
}
