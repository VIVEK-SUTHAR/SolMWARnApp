import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import formatAddress from '../util/formatAddress';
import {Account} from './providers/AuthorizationProvider';

type Props = {
  balance: number;
  address: string;
};

const AccountDetails = ({address, balance}: Props) => {
  return (
    <View style={styles.accountCard}>
      <Text style={styles.text}>Address: {formatAddress(address)}</Text>
      <Text style={styles.text}>Balance: {balance} SOL</Text>
    </View>
  );
};

export default AccountDetails;
const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 18,
  },
  accountCard: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    gap: 8,
  },
});
