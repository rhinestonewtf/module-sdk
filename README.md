# Module SDK

![Coverage badge lines](./badges/badge-lines.svg)
![Coverage badge functions](./badges/badge-functions.svg)

**A TypeScript library for using Smart Account Modules in Applications**

The Module SDK allows you to:

- **Easily install and uninstall** modules for any [ERC-7579](https://erc7579.com/) account
- **Interact with** and **use** modules using a simple and consistent API
- Can be used **alongside existing account SDKs** such as [permissionless](https://www.npmjs.com/package/permissionless), [Biconomy](https://www.npmjs.com/package/@biconomy/account), [Zerodev](https://www.npmjs.com/package/@zerodevapp/sdk) and many more
- **Use existing modules**, such as:
  - **ECDSA Validator** - Use ECDSA signatures to control an account
  - **Webauthn Validator** - Use webauthn/passkeys to control an account
  - **MFA Validator** - Set up multi-factor authentication for an account
  - **Scheduled Transfers** - Schedule transfers to occur at a future time with an optional interval
  - **Scheduled Orders** - Schedule swap orders to occur at a future time with an optional interval

In-depth documentation is available at [docs.rhinestone.wtf](https://docs.rhinestone.wtf/module-sdk/).

## Installation

Install [viem](https://viem.sh) as a peer dependency and then install the Module SDK:

```bash
npm install viem @rhinestone/module-sdk
```

```bash
pnpm install viem @rhinestone/module-sdk
```

```bash
yarn add viem @rhinestone/module-sdk
```

```bash
bun install viem @rhinestone/module-sdk
```

## Quick Start

```typescript
// Import the required functions
import {
  installModule,
  getModule,
  getAccount,
  getClient,
  getMFAValidator,
} from '@rhinestone/module-sdk'

// Create a client for the current network
const client = getClient(network)

// Create the module object if you are using a custom module
const module = getModule({
  module: moduleAddress,
  data: initData,
  type: moduleType,
})

// Or use one of the existing modules
const mfaModule = getMFAValidator({
  type: 'mfa-validator',
  data: {
    threshold: 2,
    methods: ['webauthn', 'passkey'],
  },
})

// Create the account object
const account = getAccount({
  address: '0x123...',
  type: 'erc7579-implementation',
})

// Get the actions required to install the module
const actions = await installModule({
  client,
  account,
  module,
})

// Install the module on your account, using your existing account SDK
accountSDK.execute(actions)
```

## Features

- [x] Easy installation and uninstallation of modules
- [x] Determine if a module is already installed on an account
- [x] Different Module types
  - [x] Validators
  - [x] Executors
  - [x] Hooks
  - [x] Fallbacks
- [ ] Different Modular Accounts
  - [x] ERC-7579
  - [ ] Safe
  - [ ] Biconomy
  - [ ] Kernel
- [x] Supported Modules
  - [x] ECDSA Validator
  - [x] Webauthn Validator
  - [x] MFA Validator
  - [x] Scheduled Transfers
  - [x] Scheduled Orders

## Contributing

For feature or change requests, feel free to open a PR, start a discussion or get in touch with us.

For guidance on how to create PRs, see the [CONTRIBUTING](./CONTRIBUTING.md) guide.

### Using this repo

To install dependencies, run:

```bash
pnpm install
```

To build the sdk, run:

```bash
pnpm build
```

To run tests, run:

```bash
pnpm test
```

## Authors ✨

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://twitter.com/abstractooor"><img src="https://avatars.githubusercontent.com/u/26718079" width="100px;" alt=""/><br /><sub><b>Konrad</b></sub></a><br /><a href="https://github.com/rhinestonewtf/modulekit-ui-playground/commits?author=kopy-kat" title="Code">💻</a> </td>
    <td align="center"><a href="https://github.com/YasseinBilal"><img src="https://avatars.githubusercontent.com/u/9385005?v=4" width="100px;" alt=""/><br /><sub><b>Yassin</b></sub></a><br /><a href="https://github.com/rhinestonewtf/modulekit-ui-playground/commits?author=YasseinBilal" title="Code">💻</a></td>
  </tr>
</table>
