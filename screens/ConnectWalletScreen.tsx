import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import ConnectButton from '../components/ConnectButton';
import {useAuthorization} from '../components/providers/AuthorizationProvider';
import {APP_METADATA} from '../constants';
import {useNavigation} from '@react-navigation/native';
import Logger from '../util/Logger';

export default function ConnectWalletScreen() {
  const {selectedAccount} = useAuthorization();
  const navigation = useNavigation();
  React.useEffect(() => {
    if (selectedAccount) {
      Logger.Log('Navigating to SignMessage...');
      navigation.navigate('SignMessage');
    }
  }, [selectedAccount]);
  return (
    <ImageBackground
      style={styles.mainContainer}
      source={require('../assets/onboard.png')}
      blurRadius={100}
      resizeMode="cover">
      <View style={styles.mainContainer}>
        <View>
          <Text style={styles.title}>{APP_METADATA.name}</Text>
          <Text style={styles.subtitle}>{APP_METADATA.description}</Text>
        </View>
        {!selectedAccount && <ConnectButton />}
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
});
