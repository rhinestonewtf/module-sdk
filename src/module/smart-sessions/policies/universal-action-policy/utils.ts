import { ByteArray, Hex, isHex, pad, toHex } from "viem"

export const ERROR_MESSAGES = {
    INVALID_HEX:
    "Invalid hex, if you are targeting a number, consider using pad() and toHex() from viem: pad(toHex(BigInt(2000))",
}

export type HardcodedReference = {
    raw: Hex
  }
  type BaseReferenceValue = string | number | bigint | boolean | ByteArray
  export type AnyReferenceValue = BaseReferenceValue | HardcodedReference
  /**
   *
   * parseReferenceValue
   *
   * Parses the reference value to a hex string.
   * The reference value can be hardcoded using the {@link HardcodedReference} type.
   * Otherwise, it can be a string, number, bigint, boolean, or ByteArray.
   *
   * @param referenceValue {@link AnyReferenceValue}
   * @returns Hex
   */
  export function parseReferenceValue(referenceValue: AnyReferenceValue): Hex {
    let result: Hex
    if ((referenceValue as HardcodedReference)?.raw) {
      result = (referenceValue as HardcodedReference)?.raw
    } else if (typeof referenceValue === "bigint") {
      result = pad(toHex(referenceValue), { size: 32 }) as Hex
    } else if (typeof referenceValue === "number") {
      result = pad(toHex(BigInt(referenceValue)), { size: 32 }) as Hex
    } else if (typeof referenceValue === "boolean") {
      result = pad(toHex(referenceValue), { size: 32 }) as Hex
    } else if (isHex(referenceValue)) {
      result = referenceValue
    } else if (typeof referenceValue === "string") {
      result = pad(referenceValue as Hex, { size: 32 })
    } else {
      // (typeof referenceValue === "object")
      result = pad(toHex(referenceValue as ByteArray), { size: 32 }) as Hex
    }
    if (!isHex(result) || result.length !== 66) {
      throw new Error(ERROR_MESSAGES.INVALID_HEX)
    }
    return result
  }