import { Hex, encodeAbiParameters } from 'viem'

export const getMockSignature = ({
  mockSignatures,
}: {
  mockSignatures: Hex[]
}): Hex => {
  const indices = []
  for (let i = 0; i < mockSignatures.length; i++) {
    indices.push(BigInt(i))
  }

  return encodeAbiParameters(
    [
      { name: 'validatorIndextoUse', type: 'uint256[]' },
      { name: 'signatures', type: 'bytes[]' },
    ],
    [indices, mockSignatures],
  )
}
