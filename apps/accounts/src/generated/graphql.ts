import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Context } from '@servitude/config';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: string; output: string; }
  _FieldSet: { input: any; output: any; }
};

export type Account = {
  __typename?: 'Account';
  _id: Scalars['ID']['output'];
  accountType: AccountType;
  lastFourDigits: Scalars['String']['output'];
  name: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export enum AccountType {
  CreditCard = 'CREDIT_CARD',
  Loan = 'LOAN',
  Savings = 'SAVINGS'
}

export type CreditCardAccount = {
  __typename?: 'CreditCardAccount';
  _id: Scalars['ID']['output'];
  accountType: AccountType;
  billDate: Scalars['Int']['output'];
  limit: Scalars['Float']['output'];
  name: Scalars['String']['output'];
};

export type LoanAccount = {
  __typename?: 'LoanAccount';
  _id: Scalars['ID']['output'];
  accountType: AccountType;
  date: Scalars['Date']['output'];
  emiStartDate: Scalars['Date']['output'];
  name: Scalars['String']['output'];
  totalEMIs: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCreditCardAccount: Account;
  createLoanAccount: Account;
  createSavingsAccount: Account;
};


export type MutationCreateCreditCardAccountArgs = {
  billDate: Scalars['Int']['input'];
  lastFourDigits: Scalars['String']['input'];
  limit: Scalars['Float']['input'];
  name: Scalars['String']['input'];
};


export type MutationCreateLoanAccountArgs = {
  date: Scalars['Date']['input'];
  emiStartDate: Scalars['Date']['input'];
  lastFourDigits: Scalars['String']['input'];
  name: Scalars['String']['input'];
  totalEMIs: Scalars['Int']['input'];
};


export type MutationCreateSavingsAccountArgs = {
  balance: Scalars['Float']['input'];
  interestRate: Scalars['Float']['input'];
  lastFourDigits: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  getAccount?: Maybe<Account>;
  listAccounts: Array<Account>;
};


export type QueryGetAccountArgs = {
  id: Scalars['ID']['input'];
};

export type SavingsAccount = {
  __typename?: 'SavingsAccount';
  _id: Scalars['ID']['output'];
  accountType: AccountType;
  balance: Scalars['Float']['output'];
  interestRate: Scalars['Float']['output'];
  name: Scalars['String']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ReferenceResolver<TResult, TReference, TContext> = (
      reference: TReference,
      context: TContext,
      info: GraphQLResolveInfo
    ) => Promise<TResult> | TResult;

      type ScalarCheck<T, S> = S extends true ? T : NullableCheck<T, S>;
      type NullableCheck<T, S> = Maybe<T> extends T ? Maybe<ListCheck<NonNullable<T>, S>> : ListCheck<T, S>;
      type ListCheck<T, S> = T extends (infer U)[] ? NullableCheck<U, S>[] : GraphQLRecursivePick<T, S>;
      export type GraphQLRecursivePick<T, S> = { [K in keyof T & keyof S]: ScalarCheck<T[K], S[K]> };
    

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of federation types */
export type FederationTypes = {
  Account: Account;
};

/** Mapping of federation reference types */
export type FederationReferenceTypes = {
  Account:
    ( { __typename: 'Account' }
    & GraphQLRecursivePick<FederationTypes['Account'], {"_id":true}> );
};



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Account: ResolverTypeWrapper<Account>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  AccountType: AccountType;
  CreditCardAccount: ResolverTypeWrapper<CreditCardAccount>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  LoanAccount: ResolverTypeWrapper<LoanAccount>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  SavingsAccount: ResolverTypeWrapper<SavingsAccount>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Account: Account | FederationReferenceTypes['Account'];
  ID: Scalars['ID']['output'];
  String: Scalars['String']['output'];
  CreditCardAccount: CreditCardAccount;
  Int: Scalars['Int']['output'];
  Float: Scalars['Float']['output'];
  Date: Scalars['Date']['output'];
  LoanAccount: LoanAccount;
  Mutation: Record<PropertyKey, never>;
  Query: Record<PropertyKey, never>;
  SavingsAccount: SavingsAccount;
  Boolean: Scalars['Boolean']['output'];
};

export type AccountResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Account'] = ResolversParentTypes['Account'], FederationReferenceType extends FederationReferenceTypes['Account'] = FederationReferenceTypes['Account']> = {
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Account']> | FederationReferenceType, FederationReferenceType, ContextType>;
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  accountType?: Resolver<ResolversTypes['AccountType'], ParentType, ContextType>;
  lastFourDigits?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type CreditCardAccountResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreditCardAccount'] = ResolversParentTypes['CreditCardAccount']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  accountType?: Resolver<ResolversTypes['AccountType'], ParentType, ContextType>;
  billDate?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  limit?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type LoanAccountResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LoanAccount'] = ResolversParentTypes['LoanAccount']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  accountType?: Resolver<ResolversTypes['AccountType'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  emiStartDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalEMIs?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createCreditCardAccount?: Resolver<ResolversTypes['Account'], ParentType, ContextType, RequireFields<MutationCreateCreditCardAccountArgs, 'billDate' | 'lastFourDigits' | 'limit' | 'name'>>;
  createLoanAccount?: Resolver<ResolversTypes['Account'], ParentType, ContextType, RequireFields<MutationCreateLoanAccountArgs, 'date' | 'emiStartDate' | 'lastFourDigits' | 'name' | 'totalEMIs'>>;
  createSavingsAccount?: Resolver<ResolversTypes['Account'], ParentType, ContextType, RequireFields<MutationCreateSavingsAccountArgs, 'balance' | 'interestRate' | 'lastFourDigits' | 'name'>>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getAccount?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType, RequireFields<QueryGetAccountArgs, 'id'>>;
  listAccounts?: Resolver<Array<ResolversTypes['Account']>, ParentType, ContextType>;
};

export type SavingsAccountResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SavingsAccount'] = ResolversParentTypes['SavingsAccount']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  accountType?: Resolver<ResolversTypes['AccountType'], ParentType, ContextType>;
  balance?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  interestRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  Account?: AccountResolvers<ContextType>;
  CreditCardAccount?: CreditCardAccountResolvers<ContextType>;
  Date?: GraphQLScalarType;
  LoanAccount?: LoanAccountResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SavingsAccount?: SavingsAccountResolvers<ContextType>;
};

