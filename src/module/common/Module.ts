import { Address, Hex } from "viem";

export type ModuleType = "validator" | "executor" | "fallback" | "hook";

export type Module = {
  address: Address;
  initData: Hex;
  type: ModuleType;
};
