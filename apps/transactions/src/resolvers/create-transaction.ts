import { logger } from "@servitude/logger";
import { MutationResolvers } from "../generated/graphql";
import { Transactions } from "../models/transactions.model";

export const createTransaction: NonNullable<MutationResolvers['createTransaction']> = async (
    _,
    { input },
    ctx
) => {
    if (!ctx.userId) {
        logger.error('Unauthorized access to createTransaction');
        throw new Error('Unauthorized');
    }
    const transaction = await Transactions.create({
        userId: ctx.userId,
        ...input
    });
    return transaction;
}