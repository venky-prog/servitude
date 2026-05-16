import { logger } from "@servitude/logger";
import { MutationResolvers } from "../generated/graphql";
import { Transactions } from "../models/transactions.model";

export const deleteTransaction: NonNullable<MutationResolvers['deleteTransaction']> = async (
    _,
    { _id },
    ctx
) => {
    if (!ctx.userId) {
        logger.error('Unauthorized access to deleteTransaction');
        throw new Error('Unauthorized');
    }
    const result = await Transactions.deleteOne({
        _id,
        userId: ctx.userId
    });
    if (result.deletedCount !== 1) {
        logger.error('Transaction not found');
        throw new Error('Transaction not found');
    }
    return true;
};