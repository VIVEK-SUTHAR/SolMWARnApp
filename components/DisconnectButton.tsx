import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import React, {ComponentProps} from 'react';

import {useAuthorization} from './providers/AuthorizationProvider';
import Button from './UI/Button';
import {useNavigation} from '@react-navigation/native';

type Props = Readonly<ComponentProps<typeof Button>>;

export default function DisconnectButton() {
  const {deauthorizeSession, selectedAccount} = useAuthorization();
  const navigation = useNavigation();
  React.useEffect(() => {
    if (selectedAccount == null) navigation.navigate('ConnectWallet');
  }, [selectedAccount, deauthorizeSession]);
  return (
    <Button
      style={{backgroundColor: '#FF6666'}}
      size="small"
      textStyle={{color: 'white'}}
      onPress={() => {
        transact(async wallet => {
          deauthorizeSession(wallet);
        });
      }}>
      Disconnect{' '}
    </Button>
  );
}
