---
'@rhinestone/module-sdk': minor
---

Added an optional `address` parameter to the MultiFactor management helpers (`getSetMFAThresholdAction`, `getSetMFAValidatorAction`, `getRemoveMFAValidatorAction`, `isMFASubValidator`), matching the pattern already used by `getMultiFactorValidator`. Previously these helpers always targeted the V1 (registry-bound) MultiFactor validator, so an account with only the V2 (registry-free) MultiFactor installed had no way to manage it through these functions.
