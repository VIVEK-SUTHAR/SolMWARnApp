import {ConnectionProvider} from './components/providers/ConnectionProvider';
import {clusterApiUrl} from '@solana/web3.js';
import React, {PropsWithChildren} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {AuthorizationProvider} from './components/providers/AuthorizationProvider';
import {SafeAreaView} from 'react-native-safe-area-context';
import StackNavigation from './navigation/StackNavigation';
import {RPC_ENDPOINT} from './constants';

export default function App() {
  return (
    <AppProvider>
      <StackNavigation />
    </AppProvider>
  );
}

const AppProvider = ({children}: PropsWithChildren) => {
  return (
    <ConnectionProvider
      config={{commitment: 'finalized'}}
      endpoint={clusterApiUrl(RPC_ENDPOINT)}>
      <AuthorizationProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar backgroundColor={'#351C59'} />
          {children}
        </SafeAreaView>
      </AuthorizationProvider>
    </ConnectionProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
});
