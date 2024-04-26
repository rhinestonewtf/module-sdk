export const accountAbi = [
  'function installModule(uint256 moduleTypeId,address module,bytes calldata initData)',
  'function uninstallModule(uint256 moduleTypeId,address module,bytes calldata deInitData)',
  'function isModuleInstalled(uint256 moduleTypeId,address module,bytes calldata additionalContext) returns (bool)',
]
