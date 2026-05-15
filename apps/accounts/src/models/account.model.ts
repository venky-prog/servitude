import mongoose, { Model } from 'mongoose';

enum AccountType {
  CreditCard = 'CREDIT_CARD',
  Loan = 'LOAN',
  Savings = 'SAVINGS',
  EMI = 'EMI',
}

export interface IAccount extends mongoose.Document<string> {
  name: string;
  accountType: AccountType;
  userId: string;
  // bank account properties
  interestRate?: number;
  balance?: number;
  // credit card properties
  lastFourDigits: string;
  limit?: number;
  billDate?: number;
  date: Date;
  emiStartDate: Date;
  totalEMIs: number;
  totalAmount?: number;
  emiAmount?: number;
}

interface IAccountMethods {}

const accountsSchema = new mongoose.Schema<
  IAccount,
  Model<IAccount>,
  IAccountMethods
>({
  name: { type: String, required: true },
  accountType: {
    type: String,
    enum: Object.values(AccountType),
    required: true,
  },
  userId: { type: String, required: true },
  // bank account properties
  interestRate: { type: Number },
  balance: { type: Number },
  // credit card properties
  lastFourDigits: { type: String, required: true },
  limit: { type: Number },
  billDate: { type: Number },
  date: { type: Date },
  emiStartDate: { type: Date },
  totalEMIs: { type: Number },
  totalAmount: { type: Number },
  emiAmount: { type: Number },
});

const Account = mongoose.model('Accounts', accountsSchema);

export default Account;
