import { PublicClient } from 'viem'
import { getRegistryModules } from '../../common/queries'

export const fetchRegistryModules = ({ client }: { client: PublicClient }) =>
  getRegistryModules({ client })
