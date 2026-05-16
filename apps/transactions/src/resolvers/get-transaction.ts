import { logger } from "@servitude/logger";
import { QueryResolvers } from "../generated/graphql";
import { Transactions } from "../models/transactions.model";

export const getTransaction: NonNullable<QueryResolvers['getTransaction']> = async (
    _,
    { _id },
    ctx
) => {
    if (!ctx.userId) {
        logger.error('Unauthorized access to getTransaction');
        throw new Error('Unauthorized');
    }
    const transaction = await Transactions.findOne({
        _id,
        userId: ctx.userId
    });
    if (!transaction) {
        logger.error(`Transaction with id ${_id} not found for user ${ctx.userId}`);
        throw new Error('Transaction not found');
    }
    return transaction;
}