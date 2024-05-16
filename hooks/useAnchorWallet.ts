import {useMemo} from 'react';
import * as anchor from '@coral-xyz/anchor';
import {
  transact,
  Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {PublicKey, Transaction} from '@solana/web3.js';
import {
  AuthorizeAPI,
  ReauthorizeAPI,
} from '@solana-mobile/mobile-wallet-adapter-protocol';
import { Account } from '../components/providers/AuthorizationProvider';


export function useAnchorWallet(
  authorizeSession: (wallet: AuthorizeAPI & ReauthorizeAPI) => Promise<
    Readonly<{
      address: string;
      label?: string | undefined;
      publicKey: PublicKey;
    }>
  >,
  selectedAccount: Account | null,
) {
  return useMemo(() => {
    if (!selectedAccount || !authorizeSession) {
      return null;
    }

    return {
      signTransaction: async (transaction: Transaction) => {
        return transact(async (wallet: Web3MobileWallet) => {
          await authorizeSession(wallet);
          const signedTransactions = await wallet.signTransactions({
            transactions: [transaction],
          });
          return signedTransactions[0];
        });
      },
      signAllTransactions: async (transactions: Transaction[]) => {
        return transact(async (wallet: Web3MobileWallet) => {
          await authorizeSession(wallet);
          const signedTransactions = await wallet.signTransactions({
            transactions: transactions,
          });
          return signedTransactions;
        });
      },
      get publicKey() {
        return selectedAccount.publicKey;
      },
    } as anchor.Wallet;
  }, [authorizeSession, selectedAccount]);
}