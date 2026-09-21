---
'@rhinestone/module-sdk': patch
---

Refresh the lockfile so `viem` resolves to a single version (`2.33.2`) across the workspace instead of two (a stale `2.16.3` alongside the current `2.33.2`), which broke `tsc --noEmit` for anything using types from both resolutions. CI never ran `typecheck` at all, so this went unnoticed.
