import { UserOperation } from 'permissionless'
import { concat, pad, toHex } from 'viem'

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}

export const formatUserOp = (partialUserOp: UserOperation<'v0.7'>) => {
  const initCode =
    partialUserOp.factory && partialUserOp.factoryData
      ? concat([partialUserOp.factory, partialUserOp.factoryData])
      : '0x'
  return JSON.stringify([
    {
      sender: partialUserOp.sender,
      nonce: partialUserOp.nonce,
      initCode: initCode,
      callData: partialUserOp.callData,
      accountGasLimits: concat([
        pad(toHex(partialUserOp.verificationGasLimit), {
          size: 16,
        }),
        pad(toHex(partialUserOp.callGasLimit), { size: 16 }),
      ]),
      preVerificationGas: partialUserOp.preVerificationGas,
      gasFees: concat([
        pad(toHex(partialUserOp.maxPriorityFeePerGas), {
          size: 16,
        }),
        pad(toHex(partialUserOp.maxFeePerGas), { size: 16 }),
      ]),
      paymasterAndData: '0x',
      signature: partialUserOp.signature,
    },
  ])
}
