import { ERC7579Implementation } from '../erc7579-implementation'
import { KernelImplementation } from '../kernel'
import { NexusImplementation } from '../nexus'
import { SafeImplementation } from '../safe'
import { Account } from '../types'

export const getAccountImplementation = ({ account }: { account: Account }) => {
  switch (account.type) {
    case 'erc7579-implementation':
      return new ERC7579Implementation()
    case 'kernel':
      return new KernelImplementation()
    case 'safe':
      return new SafeImplementation()
    case 'nexus':
      return new NexusImplementation()
    default:
      throw new Error(`Unsupported account type: ${account.type}`)
  }
}
