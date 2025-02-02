import { keccak256, encodePacked, Hex, Address } from 'viem';
import { PolicyType } from './types';

type ConfigId = Hex;
type PermissionId = Hex;
type ActionId = Hex;
type ActionPolicyId = Hex;
type Erc1271PolicyId = Hex;
type UserOpPolicyId = Hex;

function toActionPolicyId(permissionId: PermissionId, actionId: ActionId): ActionPolicyId {
  return keccak256(encodePacked(['bytes32', 'bytes32'], [permissionId, actionId])) as ActionPolicyId;
}

function toErc1271PolicyId(permissionId: PermissionId): Erc1271PolicyId {
  return keccak256(encodePacked(['string', 'bytes32'], ['ERC1271: ', permissionId]));
}

function toUserOpPolicyId(permissionId: PermissionId): UserOpPolicyId {
  return keccak256(encodePacked(['string', 'bytes32'], ['UserOp: ', permissionId]));
}

function toConfigId(policyId: Hex, account: Address): ConfigId {
  return keccak256(encodePacked(['address', 'bytes32'], [account, policyId]));
}

export function getConfigId(
  permissionId: PermissionId,
  policyType: PolicyType,
  account: Address,
  actionId?: ActionId
): ConfigId {
  switch (policyType) {
    case PolicyType.Action:
      if (!actionId) throw new Error('ActionId is required for Action policy');
      return toConfigId(toActionPolicyId(permissionId, actionId), account);
    case PolicyType.ERC1271:
      return toConfigId(toErc1271PolicyId(permissionId), account);
    case PolicyType.UserOp:
      return toConfigId(permissionId, account);
    default:
      throw new Error('Invalid policy type');
    }
}
