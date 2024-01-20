import React, {useCallback} from 'react';
import {StyleSheet, ToastAndroid, View} from 'react-native';
import {useAuthorization} from '../components/providers/AuthorizationProvider';
import RequestAirdropButton from '../components/RequestAirdropButton';
import TransferSol from '../components/TransferSol';
import DisconnectButton from '../components/DisconnectButton';
import LatestBlock from '../components/LatestBlockHeight';
import useSolBalance from '../hooks/useSolBalance';
import AccountDetails from '../components/AccountDetails';
import ImageBackGround from '../components/UI/ImageBackGround';

export default function Home() {
  const {balance, updateBalance} = useSolBalance();
  const {selectedAccount} = useAuthorization();

  const onAirdropComplete = useCallback(() => {
    ToastAndroid.show('Airdropped 1 SOL 🤑', ToastAndroid.SHORT);
    updateBalance(selectedAccount!);
  }, [balance, updateBalance]);

  return (
    <ImageBackGround>
      <View style={styles.mainContainer}>
        <LatestBlock />
        <AccountDetails
          address={selectedAccount?.publicKey?.toString() ?? ''}
          balance={balance ?? 0}
        />
        <TransferSol />
        <View style={styles.buttonGroup}>
          <DisconnectButton />
          <RequestAirdropButton
            onAirdropComplete={onAirdropComplete}
            selectedAccount={selectedAccount!}
          />
        </View>
      </View>
    </ImageBackGround>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 8,
    gap: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
