import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import {useAuthorization} from '../components/providers/AuthorizationProvider';
import SignMessageButton from '../components/SignMessageButton';
import formatAddress from '../util/formatAddress';

export default function SignMessage() {
  const {selectedAccount} = useAuthorization();

  return (
    <ImageBackground
      style={styles.mainContainer}
      source={require('../assets/onboard.png')}
      blurRadius={100}
      resizeMode="cover">
      <View style={styles.mainContainer}>
        <View>
          <Text style={styles.title}>Sign Message</Text>
          <Text style={styles.subtitle}>
            Sign a message with your wallet to prove your identity
          </Text>
          <Text style={styles.address}>
            Wallet: {formatAddress(selectedAccount?.publicKey?.toString()!)}
          </Text>
        </View>
        {selectedAccount && <SignMessageButton />}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  address: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
});
