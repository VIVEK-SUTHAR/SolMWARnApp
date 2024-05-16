import {
  Linking,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import React, {useState} from 'react';
import ImageBackGround from '../components/UI/ImageBackGround';
import {useConnection} from '../components/providers/ConnectionProvider';
import {useAnchorWallet} from '../hooks/useAnchorWallet';
import {useAuthorization} from '../components/providers/AuthorizationProvider';
import {useSolDemoProgram} from '../hooks/useSolDemoProgram';
import {PublicKey, SystemProgram} from '@solana/web3.js';
import Button from '../components/UI/Button';
import AllMessages from '../components/AllMessages';

const ProgramExample = () => {
  const {authorizeSession, selectedAccount} = useAuthorization();
  const {connection} = useConnection();
  const a = useAnchorWallet(authorizeSession, selectedAccount);
  const {solDemoProgram, messagePDA} = useSolDemoProgram(connection, a);
  const [messageText, setMessageText] = useState('');
  const [txnHash, setTxnHash] = useState<string | null>(null);

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
  const createMessage = async () => {
    if(!messageText.length) {
      ToastAndroid.show("Type something",ToastAndroid.SHORT)
      return
    }
    console.log('a', a?.publicKey);
    const message = solDemoProgram?.methods
      .sendMessage(messageText)
      .accounts({
        messageAcc: messagePDA,
        signer: new PublicKey(a?.publicKey!),
        systemProgram: SystemProgram.programId,
      })
      .rpc()
      .then(res => {
        console.log('Hash', res);
        setTxnHash(`https://solscan.io/tx/${res}?cluster=devnet`);
        ToastAndroid.show('Message Sent !', ToastAndroid.SHORT);
      })
      .catch(e => {
        console.log('err', e);
      });
  };
  return (
    <ImageBackGround>
      <View>
        <AllMessages />
      </View>
      <View style={styles.input}>
        <TextInput
          style={styles.input}
          onChange={e => setMessageText(e.nativeEvent.text)}
          placeholder="Type your Text Here"
        />
        {txnHash && (
          <Button
            size="small"
            onPress={() => {
              Linking.openURL(txnHash);
            }}>
            View on SolScan
          </Button>
        )}
        <Button loadingLabel="" onPress={createMessage}>
          Create Message
        </Button>
      </View>
    </ImageBackGround>
  );
};

export default ProgramExample;

const styles = StyleSheet.create({
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    gap: 8,
  },
});
