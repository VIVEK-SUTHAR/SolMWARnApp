import {AnchorProvider, Program} from '@coral-xyz/anchor';
import {Connection, PublicKey} from '@solana/web3.js';
import {useMemo} from 'react';
import * as anchor from '@coral-xyz/anchor';
import idl from '../constants/idl.json';

const MESSAGE_PDA_BASE_SEED = 'sender';

export const PROGRAM_ID = new PublicKey(
  'B6Beurf2pUi5oy4utq3jTDoFeapDt58PiEsX3q1ZznVM',
);
export function getMessagePDA(walletAddress: Buffer) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(MESSAGE_PDA_BASE_SEED), walletAddress],
    PROGRAM_ID,
  )[0];
}

export function useSolDemoProgram(
  connection: Connection,
  anchorWallet: anchor.Wallet | null,
) {
  const solDemoProgramId = PROGRAM_ID;

  const messagePDA = getMessagePDA(anchorWallet?.publicKey?.toBuffer()!);

  const provider = useMemo(() => {
    if (!anchorWallet) {
      return null;
    }
    return new AnchorProvider(connection, anchorWallet, {
      preflightCommitment: 'confirmed',
      commitment: 'processed',
    });
  }, [anchorWallet, connection]);

  const solDemoProgram = new Program(
    idl as anchor.Idl,
    solDemoProgramId,
    provider,
  );

  const value = {
    solDemoProgram: solDemoProgram,
    solDemoProgramId: solDemoProgramId,
    messagePDA: messagePDA,
  }

  return value;
}
