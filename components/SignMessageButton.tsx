import React, {useState, useCallback} from 'react';
import {
  transact,
  Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';

import {useAuthorization} from './providers/AuthorizationProvider';
import Button from './UI/Button';
import {ToastAndroid} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default function SignMessageButton() {
  const navigation = useNavigation();
  const {authorizeSession} = useAuthorization();
  const [signingInProgress, setSigningInProgress] = useState(false);
  const signMessage = useCallback(
    async (messageBuffer: Uint8Array) => {
      return await transact(async (wallet: Web3MobileWallet) => {
        const authorizationResult = await authorizeSession(wallet);
        const signedMessages = await wallet.signMessages({
          addresses: [authorizationResult.address],
          payloads: [messageBuffer],
        });
        
        return signedMessages[0];
      });
    },
    [authorizeSession],
  );

  return (
    <Button
      isLoading={signingInProgress}
      onPress={async () => {
        if (signingInProgress) {
          return;
        }
        setSigningInProgress(true);
        try {
          const message = 'I am signing this message to prove my identity';
          const messageBuffer = new Uint8Array(
            message.split('').map(c => c.charCodeAt(0)),
          );
          const signedMessage = await signMessage(messageBuffer);
          if (signedMessage) {
            navigation.navigate('Home');
          }
        } catch (err: any) {
          ToastAndroid.show('Failed to Sign Message', ToastAndroid.SHORT);
        } finally {
          setSigningInProgress(false);
        }
      }}>
      Sign Message
    </Button>
  );
}
