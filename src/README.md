# Module SDK

![Coverage badge lines](https://raw.githubusercontent.com/rhinestonewtf/module-sdk/main/badges/badge-lines.svg)
![Coverage badge functions](https://raw.githubusercontent.com/rhinestonewtf/module-sdk/main/badges/badge-functions.svg)

**A TypeScript library for using smart account modules in applications**

The Module SDK allows you to:

- **Easily install and uninstall** modules for any [ERC-7579](https://erc7579.com/) account
- **Interact with** and **use** modules using a simple and consistent API
- Can be used **alongside existing account SDKs** such as [permissionless.js](https://www.npmjs.com/package/permissionless), [Biconomy](https://www.npmjs.com/package/@biconomy/account), [Zerodev](https://www.npmjs.com/package/@zerodevapp/sdk) and many more
- **Use core modules**, such as:
  - Auto Savings: Automatically allocate a set percentage of any incoming token to a target vault
  - ColdStorage Hook: Restrict all transactions with a timelock and only allow funds to be sent to a single address
  - Deadman Switch: Recover an account after a specified inactive period
  - Hook Multiplexer: Combine multiple hooks into one with fine-grained control over when they are called
  - Multi Factor: Use multiple validators in combination as a multi-factor authentication system
  - Ownable Executor: Allow an account to control a subaccount and pay for its transaction fees
  - Ownable Validator: Authenticate on your account with multiple ECDSA keys
  - Registry Hook: Query the Module Registry before installing and using modules
  - Scheduled Orders: Execute swaps on a specified schedule
  - Scheduled Transfers: Transfer funds on a specified schedule
  - Social Recovery: Recover your account using a set of guardians

In-depth documentation is available at [docs.rhinestone.wtf](https://docs.rhinestone.wtf/module-sdk/).

## Using the ModuleSDK

### Installation

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

### Quick Start

```typescript
// Import the required functions
import {
  installModule,
  getModule,
  getAccount,
  getClient,
  getMultiFactorValidator,
} from '@rhinestone/module-sdk'

// Create a client for the current network
const client = getClient({
  rpcUrl: 'https://rpc.ankr.com/eth	',
})

// Create the module object if you are using a custom module
const moduleToInstall = getModule({
  module: moduleAddress,
  data: initData,
  type: moduleType,
})

// Or use one of the existing modules
moduleToInstall = getMultiFactorValidator({
  threshold: 2,
  validators: [
    {
      packedValidatorAndId: '0x123...',
      data: '0x123...',
    },
    {
      packedValidatorAndId: '0x456...',
      data: '0x123...',
    },
  ],
})

// Create the account object
const account = getAccount({
  address: '0x123...',
  type: 'erc7579-implementation',
})

// Get the executions required to install the module
const executions = await installModule({
  client,
  account,
  moduleToInstall,
})

// Install the module on your account, using your existing account SDK
// note: this is an example, you should use your own account SDK
accountSDK.execute(executions)
```

## Using this repo

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

## Contributing

For feature or change requests, feel free to open a PR, start a discussion or get in touch with us.
