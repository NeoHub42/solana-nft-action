const express = require('express');
   const { Connection, PublicKey, Transaction, SystemProgram } = require('@solana/web3.js');
   const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');

   const app = express();
   app.use(express.json());

   app.get('/api/buy-nft', (req, res) => {
     res.json({
       icon: 'https://your-icon-url.com/nft-icon.png',
       title: 'Buy Awesome NFT',
       description: 'Purchase this limited edition NFT on Solana',
       label: 'Buy NFT',
     });
   });

   app.post('/api/buy-nft', async (req, res) => {
     const { account } = req.body;
     
     // Replace with your NFT details
     const nftMint = new PublicKey('4JBzwTUtEWmMRv8KfirBaUtx1kDpmDyfR4XF22atwYWm');
     const price = 1000000000; // 1 SOL in lamports
     
     // Replace with your wallet that receives payment
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
     
     // Add NFT transfer instruction here (simplified for this example)
     
     const serializedTransaction = transaction.serialize({requireAllSignatures: false});
     const base64Transaction = serializedTransaction.toString('base64');
     
     res.json({
       transaction: base64Transaction,
       message: 'Please sign the transaction to purchase the NFT',
     });
   });

   const port = process.env.PORT || 3000;
   app.listen(port, () => {
     console.log(`Server running on port ${port}`);
   });
