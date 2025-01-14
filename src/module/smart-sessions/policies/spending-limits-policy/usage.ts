import { Address, Hex, PublicClient } from 'viem';
import { SPENDING_LIMITS_POLICY_ADDRESS } from './constants';
import { abi } from './abi';

type SpendingLimitPolicyData = {
    alreadySpent: string;
    approvedAmount: string;
    spendingLimit: string;
}

export const getPolicyData = async ({
    client,
    configId,
    multiplexer,
    token,
    userOpSender,
}: {
    client: PublicClient;
    configId: Hex;
    multiplexer: Address;
    token: Address;
    userOpSender: Address;
}) => {
    return (await client.readContract({
        address: SPENDING_LIMITS_POLICY_ADDRESS,
        abi: abi,
        functionName: 'getPolicyData',
        args: [configId, multiplexer, token, userOpSender],
    })) as SpendingLimitPolicyData;
}