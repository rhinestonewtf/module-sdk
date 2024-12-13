export const factoryAbi = [
  'function createAccount(bytes32 salt,bytes calldata initCode) returns (address)',
]

export const bootstrapAbi = [
  'function singleInitMSA(address validator, bytes calldata data)',
  'function initMSA(BootstrapConfig[] calldata $valdiators,BootstrapConfig[] calldata $executors,BootstrapConfig calldata _hook,BootstrapConfig[] calldata _fallbacks)',
  'struct BootstrapConfig {address module;bytes data;}',
]

export const accountAbi = [
  'function getActiveHook() external view returns (address hook)',
  'function getValidatorsPaginated(address cursor,uint256 size) returns (address[] memory, address)',
  'function getExecutorsPaginated(address cursor,uint256 size) returns (address[] memory, address)',
  'function installModule(uint256 moduleTypeId,address module,bytes calldata initData)',
  'function uninstallModule(uint256 moduleTypeId,address module,bytes calldata deInitData)',
  'function isModuleInstalled(uint256 moduleTypeId,address module,bytes calldata additionalContext) returns (bool)',
]
