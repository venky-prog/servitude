import mongoose, { Model } from 'mongoose';

enum AccountType {
  CreditCard = 'CREDIT_CARD',
  Loan = 'LOAN',
  Savings = 'SAVINGS',
}

interface IAccounts extends mongoose.Document<string> {
  name: string;
  accountType: AccountType;
  userId: string;
  // bank account properties
  interestRate?: number;
  balance?: number;
  // credit card properties
  cardLastDigits?: number;
  limit?: number;
  billDate?: number;
  // loan account properties
  loanNumber: string;
  date: Date;
  emiStartDate: Date;
  totalEMIs: number;
}

interface IAccountMethods {}

const accountsSchema = new mongoose.Schema<
  IAccounts,
  Model<IAccounts>,
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
  cardLastDigits: { type: Number },
  limit: { type: Number },
  billDate: { type: Number },
  // loan account properties
  loanNumber: { type: String },
  date: { type: Date },
  emiStartDate: { type: Date },
  totalEMIs: { type: Number },
});

const Accounts = mongoose.model('Accounts', accountsSchema);

export default Accounts;
