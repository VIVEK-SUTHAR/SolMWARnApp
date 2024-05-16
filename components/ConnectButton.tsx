import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import React, {useState, useCallback} from 'react';

import {useAuthorization} from './providers/AuthorizationProvider';

import Button from './UI/Button';
import {useNavigation} from '@react-navigation/native';
import {ToastAndroid} from 'react-native';
import Logger from '../util/Logger';

export default function ConnectButton() {
  const navigation = useNavigation();
  const {authorizeSession, selectedAccount} = useAuthorization();
  const [authorizationInProgress, setAuthorizationInProgress] = useState(false);
  const handleConnectPress = useCallback(async () => {
    try {
      if (authorizationInProgress) {
        return;
      }
      setAuthorizationInProgress(true);
      await transact(async wallet => {
        await authorizeSession(wallet);
      });
    } catch (err: any) {
      ToastAndroid.show('Failed to connect wallet', ToastAndroid.SHORT);
    } finally {
      setAuthorizationInProgress(false);
    }
  }, [authorizationInProgress, authorizeSession, selectedAccount]);

  React.useEffect(() => {
    if (selectedAccount) {
      Logger.Log('Navigating to SignMessage');
      navigation.navigate('ProgramExample');
    }
  }, [selectedAccount]);

  return (
    <Button isLoading={authorizationInProgress} onPress={handleConnectPress}>
      Connect Wallet
    </Button>
  );
}
