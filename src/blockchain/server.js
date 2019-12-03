const bodyParser = require('body-parser');
const express = require('express')
const fs = require('fs');
const app = express();
const detect = require('detect-port');
const axios = require('axios');
const config = require('../jsons/myconfig.json');
const MIN_PORT = 3001;
const MAX_PORT = 4000;
const address = 'http://localhost:';
const PORT = process.env.PORT || config.address || MIN_PORT;
const Block = require('./structure/Block');
let blockchain = require('../jsons/blockchains.json');
let myWallet = blockchain.wallets[PORT];

app.use(bodyParser.json());

app.get('/', (req, res) => res.send(req.body));

//Receive the current "Token" with the Blockchain Info
app.post('/receive', (req, res) => {
  console.log("Receiving block...");
  try {
    if (req.body.hasNewTransaction) {
      console.log("Processing block...");
      //Does stuff
      let pending = checkPending(req.body.ledger);
      let myTransactions = checkIfItsMine(pending);
      //If I have any transaction
      if (myTransactions) {
        fs.writeFile('../jsons/' + req.body.name, req.body);
      } else {
        pending.forEach((transaction) => {
          validateTransaction(transaction);
        });
      }
      res.status(201).send("Modified"); //TODO maybe add something else
    } else {
      sendToken(req.body, myWallet);
      console.log("Response sent");
      res.status(202).send("Not Modified");
    }
  } catch (err) {
    console.log("Error");
    res.status(500).send("Error");
  }
});

//Receives request for a trade
//If user available, alert the front end
//Else, post a pending transaction to the ledger
app.post('/trade', (req, res) => {
  try {
    
  } catch (err) {

  }

});

app.listen(PORT, () => console.log(`Local server running on PORT: ${PORT}!\nWelcome ${myWallet.name} to the ${blockchain.name} blockchain!`));

//Sends the current blockchain to the next available user
sendToken = (_blockchain, _wallet) => {
  console.log("Sending block to " + _wallet.next + "...");
  try {
    axios.post(address + _wallet.next + '/receive', _blockchain)
      .then((res) => {
        console.log("Block received by " + _wallet.next);
        console.log(res.status);
        //TODO possibly check for received code
      }, (err) => {
        console.log("Error: " + err);
        console.log("Retrying with next block");
        
        sendToken(_blockchain, _blockchain.wallets[_wallet.next]);
      }
    );
  } catch (err) {
      console.log(err);
  }
};

checkPending = (_ledger) => {
  let ret = [];

  _ledger.forEach((transaction) => {
    if (transaction.isPending)
      ret.push(transaction);
  });

  return ret;
};

checkIfItsMine = (_pending) => {
  let ret = [];

  _pending.forEach((transaction) => {
    if(transaction.address2 == PORT)
      ret.push(transaction);
  });

  return ret;
}

validateTransaction = (transaction) => {
  if (Block.mineBlock(transaction)) {
    transaction.currentRank = transaction.currentRank + (blockchain.wallet.length - myWallet.ranking);
    let newHash = Block.hash(transaction);
    transaction.lastHash = newHash;

    if (transaction.currentRank >= transaction.ranking) {
      transaction.isComplete = true;
      blockchain.ledger[transaction.firstHash] = transaction;
      //Update wallets
    }
    fs.writeFile('../jsons/blockchains.json', blockchain);
  } else {
    delete blockchain.ledger[transaction];
  }
};


//TODO Need a sign up function to take the private address in order to accept the PORT