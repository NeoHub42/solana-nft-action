const express = require('express');
const { Connection, PublicKey, Transaction, SystemProgram } = require('@solana/web3.js');
const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');

const app = express();
app.use(express.json());

// Add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.get('/api/buy-nft', (req, res) => {
  res.json({
    icon: 'https://your-icon-url.com/nft-icon.png',
    title: 'Buy Awesome NFT',
    description: 'Purchase this limited edition NFT on Solana',
    label: 'Buy NFT',
  });
});

app.post('/api/buy-nft', async (req, res) => {
  try {
    const { account } = req.body;
    
    // NFT details
    const nftMint = new PublicKey('4JBzwTUtEWmMRv8KfirBaUtx1kDpmDyfR4XF22atwYWm');
    const price = 1_000_000_000; // 1 SOL in lamports
    
    // Seller wallet
    const sellerWallet = new PublicKey('5hCnhQxsrxdR87ZVr2HYW2iUhxLqWrCKiZhB58pmHtVN');
    
    const buyerWallet = new PublicKey(account);
    
    const connection = new Connection('https://api.mainnet-beta.solana.com');
    
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: buyerWallet,
        toPubkey: sellerWallet,
        lamports: price,
      })
    );
    
    // Note: NFT transfer instruction is not implemented here.
    // You would need to add the appropriate instruction to transfer the NFT to the buyer.
    
    const recentBlockhash = await connection.getRecentBlockhash();
    transaction.recentBlockhash = recentBlockhash.blockhash;
    transaction.feePayer = buyerWallet;
    
    const serializedTransaction = transaction.serialize({requireAllSignatures: false});
    const base64Transaction = serializedTransaction.toString('base64');
    
    res.json({
      transaction: base64Transaction,
      message: 'Please sign the transaction to purchase the NFT',
    });
  } catch (error) {
    console.error('Error processing NFT purchase:', error);
    res.status(500).json({ error: 'An error occurred while processing the NFT purchase' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
