import React, {useCallback, useEffect, useState} from 'react';
import Logger from '../util/Logger';
import {useConnection} from '../components/providers/ConnectionProvider';
import {
  Account,
  useAuthorization,
} from '../components/providers/AuthorizationProvider';
import formatSolBalance from '../util/formatBalance';

function useSolBalance() {
  const {connection} = useConnection();
  const {selectedAccount} = useAuthorization();
  const [balance, setBalance] = useState<number | null>(null);
  const fetchAndUpdateBalance = useCallback(
    async (account: Account) => {
      Logger.Log('Fetching balance for: ' + account.publicKey);
      const fetchedBalance = await connection.getBalance(account.publicKey);
      Logger.Success('Fetched balance for: ' + account.publicKey);
      if (fetchedBalance === null) return;
      setBalance(formatSolBalance(fetchedBalance));
    },
    [connection],
  );

  const updateBalance = useCallback(async (account:Account) => {
    if (!selectedAccount) {
      return;
    }
    await fetchAndUpdateBalance(selectedAccount);
  }, [fetchAndUpdateBalance, selectedAccount]);

  useEffect(() => {
    if (!selectedAccount) {
      return;
    }
    fetchAndUpdateBalance(selectedAccount);
  }, [fetchAndUpdateBalance, selectedAccount]);

  return {balance, updateBalance};
}

export default useSolBalance;
