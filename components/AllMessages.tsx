import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useAuthorization} from './providers/AuthorizationProvider';
import {useConnection} from './providers/ConnectionProvider';
import {useAnchorWallet} from '../hooks/useAnchorWallet';
import {PROGRAM_ID, useSolDemoProgram} from '../hooks/useSolDemoProgram';
import { PublicKey } from '@solana/web3.js';

type Message = {
  message: string;
  publicKey: string;
};
const AllMessages = () => {
  const [allMessages, setAllMessages] = useState<Message[] | null>(null);
  const {authorizeSession, selectedAccount} = useAuthorization();
  const {connection} = useConnection();

  const a = useAnchorWallet(authorizeSession, selectedAccount);
  const {solDemoProgram, solDemoProgramId, messagePDA} = useSolDemoProgram(
    connection,
    a,
  );
  function decode(accountName: string, ix) {
    const layout =
      solDemoProgram.account.message.coder.accounts.accountLayouts.get(
        'Message',
      );
    const data = ix.data.slice(8);
    if (!layout) {
      throw new Error(`Unknown account: ${accountName}`);
    }
    const decoded = layout.decode(data);
    return {
      pubKey: ix.owner,
      account: decoded,
    };
  }

  React.useEffect(() => {
    const getAllMessages = async (): Promise<Message[] | null> => {
      const acc = await connection.getProgramAccounts(PROGRAM_ID);
      let messages: Message[] = [];
      if (acc && acc.length > 0) {
        for await (const iterator of acc) {
          const accountData = await connection.getAccountInfo(iterator.pubkey);
          const formattedData = decode('message', accountData);
          const renderData: Message = {
            message: formattedData.account?.data,
            publicKey: formattedData.account?.signer,
          };
          messages.push(renderData);
        }
        return messages;
      }
      return null;
    };
    getAllMessages()
      .then(data => {
        setAllMessages(data);
      })
      .catch(e => console.log('e', e));
  }, []);
  return (
    <View>
      {allMessages ? (
        <FlatList
          data={allMessages}
          renderItem={({item}: {item: Message}) => {
            return (
              <MessageCard message={item.message} publicKey={item.publicKey} />
            );
          }}
        />
      ) : null}
    </View>
  );
};

const MessageCard = ({message, publicKey}: Message) => {
  
  
  return (
    <View style={styles.accountCard}>
      <Text style={styles.text}>📝 {message}</Text>
      <Text style={styles.text}>By :{new PublicKey(publicKey).toString()}</Text>
    </View>
  );
};

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
    marginVertical: 4,
  },
});

export default AllMessages;
