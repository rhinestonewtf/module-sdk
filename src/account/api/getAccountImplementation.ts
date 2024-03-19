import { ERC7579Implementation } from '../erc7579-implementation'
import { Account } from '../types'

export const getAccountImplementation = ({ account }: { account: Account }) => {
  let accountImplementation
  switch (account.type) {
    case 'erc7579-implementation':
      accountImplementation = new ERC7579Implementation()
      break
  }
  return accountImplementation
}
