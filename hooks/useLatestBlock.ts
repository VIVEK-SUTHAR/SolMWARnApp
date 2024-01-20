import {useEffect, useState} from 'react';
import {useConnection} from '../components/providers/ConnectionProvider';

const FETCH_BLOCK_INTERVAL = 2000;

const useLatestBlock = () => {
  const [latestBlockHeight, setblockNumber] = useState(0);
  const {connection} = useConnection();

  useEffect(() => {
    const getLatestBlock = async () => {
      const latestBlock = await connection.getBlockHeight();

      setblockNumber(latestBlock);
    };
    const blockInterval = setInterval(() => {
      getLatestBlock();
    }, FETCH_BLOCK_INTERVAL);
    if (connection) {
      getLatestBlock();
    }

    return () => clearInterval(blockInterval);
  }, [latestBlockHeight]);

  return {latestBlockHeight};
};

export default useLatestBlock;
