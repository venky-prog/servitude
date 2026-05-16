import { Resolvers } from "../generated/graphql";
import { createTransaction } from "./create-transaction";
import { deleteTransaction } from "./delete-transaction";
import { getTransaction } from "./get-transaction";
import { updateTransaction } from "./update-transaction";
import { listTransactions } from "./list-transactions";
import { Transactions } from "../models/transactions.model";
import {resolvers as scalarResolvers} from 'graphql-scalars'

const resolvers: Resolvers = {
    ...scalarResolvers,
    Query: {
        getTransaction,
        listTransactions
    },
    Mutation: {
        createTransaction,
        updateTransaction,
        deleteTransaction
    },
    Transaction: {
        user: (parent) => {
            return { __typename: 'User' as const, _id: parent.userId }
        },
        account: (parent) => {
            return { __typename: 'Account' as const, _id: parent.accountId }
        },
        __resolveReference: async (ref) => {
            const transaction = await Transactions.findById(ref._id);
            return transaction;
        },
    }
}

export default resolvers