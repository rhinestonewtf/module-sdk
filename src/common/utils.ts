import { Address, PublicClient } from "viem";

export const isContract = async (client: PublicClient, address: Address) => {
  const bytecode = await client.getBytecode({
    address: address,
  });
  return bytecode !== "0x";
};
