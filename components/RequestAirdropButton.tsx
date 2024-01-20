import {useConnection} from '../components/providers/ConnectionProvider';
import React, {useState, useCallback} from 'react';
import {ToastAndroid} from 'react-native';
import {Account} from './providers/AuthorizationProvider';
import Button from './UI/Button';
import {LAMPORTS_PER_SOL} from '@solana/web3.js';
import Logger from '../util/Logger';

type Props = Readonly<{
  selectedAccount: Account;
  onAirdropComplete: (account: Account) => void;
}>;

export default function RequestAirdropButton({
  selectedAccount,
  onAirdropComplete,
}: Props) {
  const {connection} = useConnection();
  const [airdropInProgress, setAirdropInProgress] = useState(false);
  const requestAirdrop = useCallback(async () => {
    try {
      if (airdropInProgress) {
        return;
      }
      setAirdropInProgress(true);
      const signature = await connection.requestAirdrop(
        selectedAccount.publicKey,
        LAMPORTS_PER_SOL,
      );
      const result = await connection.confirmTransaction(signature);
      Logger.Success('Airdrop successful!', result);
      onAirdropComplete(selectedAccount);
    } catch (error) {
      ToastAndroid.show('Airdrop failed', ToastAndroid.SHORT);
      Logger.Error('Airdrop failed', error);
    } finally {
      setAirdropInProgress(false);
    }
  }, [connection, selectedAccount, airdropInProgress, onAirdropComplete]);
  return (
    <Button size="small" isLoading={airdropInProgress} onPress={requestAirdrop}
    loadingLabel='Airdropping...'
    >
      Request Airdrop
    </Button>
  );
}
