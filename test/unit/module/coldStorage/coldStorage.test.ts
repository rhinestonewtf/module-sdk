import {
  COLD_STORAGE_HOOK_ADDRESS,
  COLD_STORAGE_FLASHLOAN_ADDRESS,
  getColdStorageSetWaitPeriodAction,
  getColdStorageExecutionTime,
  getRequestTimelockedExecution,
  getRequestTimelockedModuleConfigExecution,
  getFlashloanAddAddressAction,
  getFlashloanRemoveAddressAction,
  getFlashloanWhitelist,
} from 'src'
import { Address, toHex } from 'viem'
import { getClient } from 'src'
import { MockClient } from '../../../utils/mocks/client'
import { getAccount } from 'src/account'
import { MockAccountDeployed } from '../../../utils/mocks/account'
import {
  getInstallColdStorageHook,
  getInstallAllowedCallbackSenders,
} from 'src'
import { CallType } from 'src'

describe('Cold storage Module', () => {
  // Setup
  const client = getClient(MockClient)
  const account = getAccount(MockAccountDeployed)
  const addresses = ['0x0Cb7EAb54EB751579a82D80Fe2683687deb918f3'] as Address[]
  const executionHash = toHex('test_hash', { size: 32 })

  it('should get install cold storage hook module', async () => {
    const installColdStorageModule = await getInstallColdStorageHook({
      account,
      client,
      moduleType: 'hook',
      owner: account.address,
      waitPeriod: 100,
    })

    expect(installColdStorageModule.module).toEqual(COLD_STORAGE_HOOK_ADDRESS)
    expect(installColdStorageModule.data).toBeDefined()
    expect(installColdStorageModule.type).toEqual('hook')
  })

  it('should get install cold storage flashloan module', async () => {
    const installColdStorageFlashloanModule = getInstallAllowedCallbackSenders({
      addresses,
      selector: '0x00000000',
      callType: CallType.CALLTYPE_SINGLE,
    })

    expect(installColdStorageFlashloanModule.module).toEqual(
      COLD_STORAGE_FLASHLOAN_ADDRESS,
    )
    expect(installColdStorageFlashloanModule.data).toBeDefined()
    expect(installColdStorageFlashloanModule.type).toEqual('fallback')
  })

  it('should get setWaitPeriod Execution', async () => {
    const setWaitPeriodExecution = getColdStorageSetWaitPeriodAction({
      waitPeriod: 100,
    })

    expect(setWaitPeriodExecution.target).toEqual(COLD_STORAGE_HOOK_ADDRESS)
    expect(setWaitPeriodExecution.value).toEqual(BigInt(0))
    expect(setWaitPeriodExecution.callData).toBeDefined()
  })

  it('should return zero if execution hash not found', async () => {
    const executionTime = await getColdStorageExecutionTime({
      account,
      client,
      executionHash,
    })

    expect(executionTime).toEqual(0)
  })

  it('should return requestTimelocked Execution', async () => {
    const requestTimelockedExecution = getRequestTimelockedExecution({
      execution: {
        target: account.address,
        value: BigInt(0),
        callData: '0x',
      },
      additionalWait: 100,
    })

    expect(requestTimelockedExecution.target).toEqual(COLD_STORAGE_HOOK_ADDRESS)
    expect(requestTimelockedExecution.value).toEqual(BigInt(0))
    expect(requestTimelockedExecution.callData).toBeDefined()
  })

  it('should return getRequestTimelockedModuleConfig Execution', async () => {
    const requestTimelockedModuleConfig =
      getRequestTimelockedModuleConfigExecution({
        moduleTypeId: 1,
        module: account.address,
        data: '0x',
        isInstall: true,
        additionalWait: 100,
      })

    expect(requestTimelockedModuleConfig.target).toEqual(
      COLD_STORAGE_HOOK_ADDRESS,
    )
    expect(requestTimelockedModuleConfig.value).toEqual(BigInt(0))
    expect(requestTimelockedModuleConfig.callData).toBeDefined()
  })

  it('should return add address execution for vsc flashloan', async () => {
    const addAddressExecution = getFlashloanAddAddressAction({
      addressToAdd: account.address,
    })

    expect(addAddressExecution.target).toEqual(COLD_STORAGE_FLASHLOAN_ADDRESS)
    expect(addAddressExecution.value).toEqual(BigInt(0))
    expect(addAddressExecution.callData).toBeDefined()
  })

  it('should throw error if address to remove does not exist', async () => {
    let removeAddressExecution

    try {
      removeAddressExecution = await getFlashloanRemoveAddressAction({
        addressToRemove: addresses[0],
        account,
        client,
      })
    } catch (error) {
      expect((removeAddressExecution as Error).message).toEqual(
        'Address not found',
      )
    }
  })

  it('should return empty list of whitelist addresses', async () => {
    const whitelistAddresses = await getFlashloanWhitelist({
      account,
      client,
    })

    expect(whitelistAddresses.length).toEqual(0)
  })
})
