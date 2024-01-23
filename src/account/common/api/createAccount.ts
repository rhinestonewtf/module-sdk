import { Address, Hex } from "viem";

export const createAccount = (address: Address, initCode: Hex) => {
  return {
    address,
    initCode,
  };
};
