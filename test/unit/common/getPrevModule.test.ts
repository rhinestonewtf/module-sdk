import { getAccount, getClient, getModule, getPreviousModule } from 'src'
import { MockSafeAccountDeployed } from 'test/utils/mocks/account'

// Regression tests for `getPreviousModule`, which is on the critical
// path of every validator/executor uninstall for safe /
// erc7579-implementation / nexus accounts. Historically this read the
// GraphQL indexer's `SmartAccount_ModuleQuery.module` field, which
// does not exist in the query's own selection set (`moduleAddress`,
// `moduleTypeId`) - every mapped entry was `undefined`, so the
// function always threw "Module ... not found in installed modules".
// The indexer host (`indexer.bigdevenergy.link`) also currently has
// no DNS record at all, so this path is live-broken today regardless
// of the field-name bug.
//
// These tests don't hit the network - they stub `fetch` (indexer) and
// `client.readContract` (on-chain fallback) so both paths are
// exercised deterministically.

const account = getAccount(MockSafeAccountDeployed)
const validatorA = getModule({
  address: '0x1111111111111111111111111111111111111111',
  module: '0x1111111111111111111111111111111111111111',
  initData: '0x',
  deInitData: '0x',
  additionalContext: '0x',
  type: 'validator',
})
const validatorB = getModule({
  address: '0x2222222222222222222222222222222222222222',
  module: '0x2222222222222222222222222222222222222222',
  initData: '0x',
  deInitData: '0x',
  additionalContext: '0x',
  type: 'validator',
})
const executorA = getModule({
  address: '0x3333333333333333333333333333333333333333',
  module: '0x3333333333333333333333333333333333333333',
  initData: '0x',
  deInitData: '0x',
  additionalContext: '0x',
  type: 'executor',
})

describe('getPreviousModule', () => {
  describe('via the indexer', () => {
    const client = getClient({ rpcUrl: 'http://localhost:0' })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('finds the previous module using the correct moduleAddress field, scoped to the same type', async () => {
      // Indexer returns validators and an executor interleaved, out of
      // type-sorted order, and NOT in a strict indexed-prefix
      // arrangement - only a moduleTypeId-aware filter can get this
      // right.
      jest.spyOn(client, 'getChainId').mockResolvedValue(11155111)
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            SmartAccount_ModuleQuery: [
              { moduleAddress: executorA.module, moduleTypeId: 2 },
              { moduleAddress: validatorA.module, moduleTypeId: 1 },
              { moduleAddress: validatorB.module, moduleTypeId: 1 },
            ],
          },
        }),
      } as Response)

      const prev = await getPreviousModule({
        client,
        account,
        module: validatorB,
      })

      expect(prev).toEqual(validatorA.module)
    })

    it('returns SENTINEL_ADDRESS for the first module of its type, ignoring other types', async () => {
      jest.spyOn(client, 'getChainId').mockResolvedValue(11155111)
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            SmartAccount_ModuleQuery: [
              { moduleAddress: executorA.module, moduleTypeId: 2 },
              { moduleAddress: validatorA.module, moduleTypeId: 1 },
            ],
          },
        }),
      } as Response)

      const prev = await getPreviousModule({
        client,
        account,
        module: validatorA,
      })

      expect(prev).toEqual('0x0000000000000000000000000000000000000001')
    })
  })

  describe('on-chain fallback (indexer unreachable)', () => {
    const client = getClient({ rpcUrl: 'http://localhost:0' })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('falls back to the on-chain paginated list and unwraps the [address[], address] tuple correctly', async () => {
      jest.spyOn(client, 'getChainId').mockResolvedValue(11155111)
      jest.spyOn(global, 'fetch').mockRejectedValue(new TypeError('fetch failed'))
      jest.spyOn(client, 'readContract').mockImplementation(async ({ functionName }) => {
        if (functionName === 'getValidatorsPaginated') {
          return [[validatorA.module, validatorB.module], '0x0000000000000000000000000000000000000001']
        }
        if (functionName === 'getExecutorsPaginated') {
          return [[executorA.module], '0x0000000000000000000000000000000000000001']
        }
        throw new Error(`unexpected call: ${functionName}`)
      })

      const prev = await getPreviousModule({
        client,
        account,
        module: validatorB,
      })

      expect(prev).toEqual(validatorA.module)
    })

    it('never returns an executor as the previous entry for a validator (no type mixing)', async () => {
      jest.spyOn(client, 'getChainId').mockResolvedValue(11155111)
      jest.spyOn(global, 'fetch').mockRejectedValue(new TypeError('fetch failed'))
      const readContractSpy = jest
        .spyOn(client, 'readContract')
        .mockImplementation(async ({ functionName }) => {
          if (functionName === 'getValidatorsPaginated') {
            return [[validatorA.module], '0x0000000000000000000000000000000000000001']
          }
          if (functionName === 'getExecutorsPaginated') {
            return [[executorA.module], '0x0000000000000000000000000000000000000001']
          }
          throw new Error(`unexpected call: ${functionName}`)
        })

      const prev = await getPreviousModule({
        client,
        account,
        module: validatorA,
      })

      // validatorA is the ONLY validator -> must be SENTINEL, never
      // executorA, even though executorA was fetched in the same
      // on-chain pass for a different call.
      expect(prev).toEqual('0x0000000000000000000000000000000000000001')
      expect(readContractSpy).toHaveBeenCalledWith(
        expect.objectContaining({ functionName: 'getValidatorsPaginated' }),
      )
      expect(readContractSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({ functionName: 'getExecutorsPaginated' }),
      )
    })
  })
})
