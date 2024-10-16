import { getClient } from 'src'
import { Account } from 'src/account'
import { getInstalledModules, GRAPHQL_API_URL } from 'src/common'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'

describe('Get installed modules using indexer', () => {

    const client = getClient({ rpcUrl: 'https://chain-rpc.gold.dev' })

    // Generate a random EOA address
    const privateKey = generatePrivateKey()
    const account = privateKeyToAccount(privateKey)

    const smartAccount: Account = {
        type: 'nexus',
        address: account.address,
        deployedOnChains: []
    }

    it('should return response.ok even if chain is not supported', async () => {
        const query = `
            query ($smartAccount: String, $chainId: Int) {
            SmartAccount_ModuleQuery (where: { smartAccount: { _eq: $smartAccount }, isInstalled: { _eq: true }, chainId: { _eq: $chainId }}) {
                moduleAddress,
                moduleTypeId
            }
            }
        `

        const variables = {
            smartAccount: smartAccount.address,
            chainId: await client.getChainId(),
        }

        const response = await fetch(GRAPHQL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        })

        const responseBody = await response.json()
        const modules = responseBody.data.SmartAccount_ModuleQuery.map(
            (module: any) => module.moduleAddress,
        )

        expect(modules.length).toBe(0)
        expect(response.ok).toBe(true)
    })

    it('should return empty array if smart account is not deployed', async () => {
        const modules = await getInstalledModules({
            account: smartAccount,
            client,
        })

        expect(modules.length).toBe(0)
    })
})
