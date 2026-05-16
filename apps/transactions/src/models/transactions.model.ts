import mongoose, { Document, Model } from 'mongoose';

export interface ITransactions extends Document<string> {
  accountId: string;
  amount: number;
  date: Date;
  description: string;
  userId: string;
}

interface ITransactionsMethods {}

const transactionSchema = new mongoose.Schema<
  ITransactions,
  Model<ITransactions>,
  ITransactionsMethods
>({
  accountId: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  userId: { type: String, required: true },
});

export const Transactions = mongoose.model('Transactions', transactionSchema);
