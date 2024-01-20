import {LAMPORTS_PER_SOL} from '@solana/web3.js';

function formatSolBalance(lamports: number) {
    return lamports / LAMPORTS_PER_SOL;
  
}
export default formatSolBalance