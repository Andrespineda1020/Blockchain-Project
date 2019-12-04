
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
let blockchain = require('../jsons/Manager.json');

let myWallet = blockchain.wallets[PORT];
let chainList = {};
for (let i = 0; i < myWallet.collectibles.length; i++) {
  chainList[myWallet.collectibles[i]] = require('../jsons/' + myWallet.collectibles[i] + '.json');
}

app.use(bodyParser.json());

app.get('/', (req, res) => res.send(req.body));

//Receive the current "Token" with the Blockchain Info
app.post('/receive', (req, res) => {
  let name = req.body.name;
  console.log("Receiving token from " + name);
  
  try {
    if (Object.keys(req.body.ledger).length != Object.keys(chainList[name].ledger).length) {
      console.log("Processing block...");
      //Does stuff
      let pending = checkPending(req.body.ledger);
      //If I have any transaction
      if (pending.length > 0) {
        console.log("Validating " + pending.length + " transactions");
        pending.forEach((transaction) => {
          validateTransaction(transaction, name);
        });
        console.log("Writing pending transactions");
        fs.writeFile('./src/jsons/' + req.body.name + '.json', JSON.stringify(req.body), 'utf8', (err) => {
          if (err) console.log(err)
          else console.log("Local Blockchain Updated!");
        });
      };
      res.status(201).send("Modified"); //TODO maybe add something else
      sendToken(chainList[name], myWallet);
    } else if(req.body.ledger.length > chainList[name].ledger.length) {
        console.log("Updating local " + name + " blockchain");
        for (newTransaction in req.body.ledger) {
          if (!chainList[name].ledger[newTransaction])
            validateTransaction(newTransaction, name);
        }
    } else {
      sendToken(req.body, myWallet);
      console.log("Response sent");
      res.status(202).send("Not Modified");
    }
  } catch (err) {
    console.log("Error" + err);
    res.status(500).send("Error");
  }
});

app.post('/create', (req, res) => {
  try {
    let name = req.body.name;
    let timestamp = new Date().getTime();
    let block = req.body.transaction;
    block.timestamp = timestamp;
    let ranking = chainList[name].wallets.length - chainList[name].wallets[block.address1] + chainList[name].wallets[block.address2];
    block.ranking = ranking;
    block.firstHash = Block.blockHash(block);
    console.log("Creating Block: " + block.firstHash);
    block.lastHash = block.firstHash;
    chainList[name].ledger[block.firstHash] = block;
    fs.writeFile('./src/jsons/' + req.body.name + '.json', JSON.stringify(chainList[name]), 'utf8', (err) => {
      if (err) console.log(err)
      else console.log("Local Blockchain Updated!");
    });
    res.status(201).send("Success");
  } catch (err) {
    console.log("Error creating block " + err);
    res.status(500).send("Error Updating File");
  };
  

});

//Receives request for a trade
//If user available, alert the front end
//Else, post a pending transaction to the ledger
app.post('/update', (req, res) => {
  try {
    let name = req.body.name
    console.log(req.body.isApproved ? "Approving" : "Rejecting" + " transaction number " + req.body.transactionID);
    if (req.body.isApproved) {
      chainList[name].ledger[req.body.transactionID].isPending = false;
      
    } else {
      delete chainList[name].ledger[req.body.transactionID];
    }
    fs.writeFile('./src/jsons/' + name + '.json', JSON.stringify(chainList[name]), 'utf8', (err) => {
      if (err) console.log(err)
      else console.log("Local Blockchain Updated!");
    });
  } catch (err) {
      console.log("Error Modifying Transaction: " + err);
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
  for (transaction in _ledger) {
    if (_ledger[transaction].isPending)
      ret.push(_ledger[transaction]);
  };
  console.log(ret.length);
  return ret;
};

checkIfItsMine = (_pending) => {
  let ret = [];
  for (transaction in _pending) {
    if(_pending[transaction].address2 == PORT)
      ret.push(_pending[transaction]);
  };
  console.log(ret.length);
  return ret;
}

validateTransaction = (transaction, name) => {
  console.log("Validating transaction: " + transaction.firstHash);
  if (Block.mineBlock(transaction)) {
    console.log("Block Validated");
    transaction.currentRank = transaction.currentRank + (chainList[name].wallets.length - myWallet.ranking);
    let newHash = Block.blockHash(transaction);
    transaction.lastHash = newHash;

    if (transaction.currentRank >= transaction.ranking) {
      transaction.isComplete = true;
      chainList[name].ledger[transaction.firstHash] = transaction;
      //Update wallets
      chainList[name].wallets[transaction.address1].collectibles.push(transaction.user2_value);
      chainList[name].wallets[transaction.address2].collectibles.push(transaction.user1_value);
      chainList[name].wallets[transaction.address1].splice(transaction.user1_value);
      chainList[name].wallets[transaction/address2].splice(transaction.user2_value);
    }
    fs.writeFile('./src/jsons/' + name + '.json', JSON.stringify(chainList[name]), 'utf8', (err) => {
      if (err) console.log(err)
      else console.log("Local Blockchain Updated!");
    });
    console.log("File written!");
  } else {
    delete chainList[name].ledger[transaction];
    console.log("Invalid Transaction! Deleted from Blockchain");
  }
};

updateWallet = (transaction, name) => {

}


//TODO Need a sign up function to take the private address in order to accept the PORT
=======
const bodyParser = require('body-parser');
const express = require('express')
const fs = require('fs');
const app = express();
const detect = require("detect-port");
const axios = require("axios");
const config = require("../jsons/myconfig.json");
const MIN_PORT = 3001;
const MAX_PORT = 4000;
const address = "http://localhost:";
const PORT = process.env.PORT || config.address || MIN_PORT;
const Block = require('./structure/Block');
let blockchain = require('../jsons/blockchains.json');
let myWallet = blockchain.wallets[PORT];

app.use(bodyParser.json());

app.get("/", (req, res) => res.send(req.body));

//Receive the current "Token" with the Blockchain Info
app.post('/receive', (req, res) => {
  console.log("Receiving block...");
  try {
    if (Object.keys(req.body.ledger).length != Object.keys(blockchain.ledger).length) {
      console.log("Processing block...");
      //Does stuff
      let pending = checkPending(req.body.ledger);
      // let myTransactions = checkIfItsMine(pending);
      //If I have any transaction
      if (pending.length > 0) {
        console.log("Validating " + pending.length + " transactions");
        pending.forEach((transaction) => {
          validateTransaction(transaction);
        });
        console.log("Writing pending transactions");
        fs.writeFile('./src/jsons/' + req.body.name + '.json', JSON.stringify(req.body), 'utf8', (err) => {
          if (err) console.log(err)
          else console.log("Local Blockchain Updated!");
        });
      };
      res.status(201).send("Modified"); //TODO maybe add something else
      sendToken(blockchain, myWallet);
    } else {
      sendToken(req.body, myWallet);
      console.log("Response sent");
      res.status(202).send("Not Modified");
    }
  } catch (err) {
    console.log("Error" + err);
    res.status(500).send("Error");
  }
});

app.post('/create', (req, res) => {
  try {
    let timestamp = new Date().getTime();
    let block = req.body.transaction;
    block.timestamp = timestamp;
    let ranking = blockchain.wallets.length - blockchain.wallets[block.address1] + blockchain.wallets[block.address2];
    block.ranking = ranking;
    block.firstHash = Block.blockHash(block);
    console.log("Creating Block: " + block.firstHash);
    block.lastHash = block.firstHash;
    blockchain.ledger[block.firstHash] = block;
    fs.writeFile('./src/jsons/' + req.body.name + '.json', JSON.stringify(blockchain), 'utf8', (err) => {
      if (err) console.log(err)
      else console.log("Local Blockchain Updated!");
    });
    res.status(201).send("Success");
  } catch (err) {
    console.log("Error creating block " + err);
    res.status(500).send("Error Updating File");
  };
  

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
        axios.post(address + _wallet.next + "/receive", _blockchain).then(
            res => {
                console.log("Block received by " + _wallet.next);
                console.log(res.status);
                //TODO possibly check for received code
            },
            err => {
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
  for (transaction in _ledger) {
    if (_ledger[transaction].isPending)
      ret.push(_ledger[transaction]);
  };
  console.log(ret.length);
  return ret;
};

checkIfItsMine = (_pending) => {
  let ret = [];
  for (transaction in _pending) {
    if(_pending[transaction].address2 == PORT)
      ret.push(_pending[transaction]);
  };
  console.log(ret.length);
  return ret;
}

validateTransaction = (transaction) => {
  console.log("Validating transaction: " + transaction.firstHash);
  if (Block.mineBlock(transaction)) {
    console.log("Block Validated");
    transaction.currentRank = transaction.currentRank + (blockchain.wallets.length - myWallet.ranking);
    let newHash = Block.blockHash(transaction);
    transaction.lastHash = newHash;

    if (transaction.currentRank >= transaction.ranking) {
      transaction.isComplete = true;
      blockchain.ledger[transaction.firstHash] = transaction;
      //Update wallets
    }
    fs.writeFile('./src/jsons/' + blockchain.name + '.json', JSON.stringify(blockchain), 'utf8', (err) => {
      if (err) console.log(err)
      else console.log("Local Blockchain Updated!");
    });
    console.log("File written!");
  } else {
    delete blockchain.ledger[transaction];
    console.log("Invalid Transaction! Deleted from Blockchain");
  }
};


//TODO Need a sign up function to take the private address in order to accept the PORT