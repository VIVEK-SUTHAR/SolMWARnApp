import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ToastAndroid,
  Linking,
  ScrollView,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import Button from './UI/Button';
import {fromUint8Array} from 'js-base64';

import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import {useConnection} from './providers/ConnectionProvider';
import {useAuthorization} from './providers/AuthorizationProvider';
import {
  transact,
  Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import Logger from '../util/Logger';

const TransferSol = () => {
  const [toAddress, setToAddress] = useState('');
  const [solAmmount, setSolAmmount] = useState(LAMPORTS_PER_SOL / 2);

  const {connection} = useConnection();
  const {authorizeSession} = useAuthorization();
  const [signingInProgress, setSigningInProgress] = useState(false);

  const [txnHash, setTxnHash] = useState<string | null>(null);
  const signTransaction = useCallback(async () => {
    try {
      if (signingInProgress) {
        return;
      }
      setSigningInProgress(true);
      const txn = await transact(async (wallet: Web3MobileWallet) => {
        const [authorizationResult, latestBlockhash] = await Promise.all([
          authorizeSession(wallet),
          connection.getLatestBlockhash(),
        ]);
        Logger.Success('Authorized!');

        const randomTransferTransaction = new Transaction({
          ...latestBlockhash,
          feePayer: authorizationResult.publicKey,
        }).add(
          SystemProgram.transfer({
            fromPubkey: authorizationResult.publicKey,
            toPubkey: new PublicKey(toAddress),
            lamports: solAmmount,
          }),
        );

        const signedTransactions = await wallet.signTransactions({
          transactions: [randomTransferTransaction],
        });
        Logger.Success('Signed!', signedTransactions[0]);
        return signedTransactions[0];
      });

      Logger.Log('Serialized transaction: ' + txn.serialize());
      Logger.Log('Sending transaction...');
      const signature = await connection.sendRawTransaction(txn.serialize());
      Logger.Success('Sent! Txn Hash', signature);
      setTxnHash(`https://solscan.io/tx/${signature}?cluster=devnet`);
      ToastAndroid.show('Transaction Sent !', ToastAndroid.SHORT);
    } catch (error) {
      Logger.Error('Error in Sending Txn', error);
    } finally {
      setSigningInProgress(false);
      setSolAmmount(LAMPORTS_PER_SOL / 2);
      setToAddress('');
    }
  }, [authorizeSession, connection, solAmmount, signingInProgress]);

  React.useEffect(() => {
    let unsubscribe: NodeJS.Timeout | null;
    if (txnHash) {
      unsubscribe = setTimeout(() => {
        setTxnHash(null);
      }, 5000);
    }
    return () => {
      if (unsubscribe) {
        clearTimeout(unsubscribe);
      }
    };
  }, [txnHash]);

  return (
    <View style={styles.container}>
      <ScrollView style={{height: 'auto'}}>
        <View style={{gap: 8}}>
          <Text style={styles.text}>Transfer SOL</Text>
          <TextInput
            style={styles.input}
            placeholder="To Address"
            onChangeText={text => setToAddress(text)}
            value={toAddress}
            selectionColor={'white'}
          />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Amount (SOL)"
            onChangeText={text =>
              setSolAmmount(Number(text) * LAMPORTS_PER_SOL)
            }
            selectionColor={'white'}
          />
          <Button
            size="small"
            isLoading={signingInProgress}
            onPress={signTransaction}>
            Transfer
          </Button>
          {txnHash && (
            <Button
              size="small"
              onPress={() => {
                Linking.openURL(txnHash);
              }}>
              View on SolScan
            </Button>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 18,
  },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    gap: 8,
  },
  container: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    gap: 8,
  },
  address: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
});
export default TransferSol;
