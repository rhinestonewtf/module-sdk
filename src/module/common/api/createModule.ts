import { Address, Hex } from "viem";
import { ModuleType } from "../Module";

export const createModule = (
  address: Address,
  initCode: Hex,
  type: ModuleType
) => {
  return {
    address,
    initCode,
    type,
  };
};
