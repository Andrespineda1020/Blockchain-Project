const bodyParser = require("body-parser");
const express = require("express");
const fs = require("fs");
const app = express();
const detect = require("detect-port");
const axios = require("axios");
const config = require("../jsons/myconfig.json");
const MIN_PORT = 3001;
const MAX_PORT = 4000;
const address = "http://localhost:";
const PORT = process.env.PORT || config.address || MIN_PORT;
const Block = require("./structure/Block");
let blockchain = require("../jsons/Manager.json");

let myWallet = blockchain.wallets[PORT];
let chainList = {};
for (let i = 0; i < myWallet.collectibles.length; i++) {
    chainList[myWallet.collectibles[i].name] = require("../jsons/" +
        myWallet.collectibles[i].name +
        ".json");
}
chainList["Manager"] = blockchain;
console.log(chainList);

app.use(bodyParser.json());

app.get("/", (req, res) => res.send(req.body));

//Receive the current "Token" with the Blockchain Info
app.post("/receive", (req, res) => {
    let name = req.body.name;
    console.log("Receiving token from " + name);

    try {
        if (
            Object.keys(req.body.ledger).length !=
            Object.keys(chainList[name].ledger).length
        ) {
            console.log("Processing block...");
            //Does stuff
            let pending = checkPending(req.body.ledger);
            //If I have any transaction
            if (pending.length > 0) {
                console.log("Validating " + pending.length + " transactions");
                pending.forEach(transaction => {
                    validateTransaction(transaction, name);
                });
                console.log("Writing pending transactions");
                fs.writeFile(
                    "./src/jsons/" + req.body.name + ".json",
                    JSON.stringify(req.body),
                    "utf8",
                    err => {
                        if (err) console.log(err);
                        else console.log("Local Blockchain Updated!");
                    }
                );
            }
            res.status(201).send("Modified"); //TODO maybe add something else
            sendToken(chainList[name], myWallet);
        } else if (req.body.ledger.length > chainList[name].ledger.length) {
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
/*
Function will join a user to a blockchain.
Looks at the manager, assignes the next port to the user, changes the last port in the manager
Edits the specific JSON for the blockchain, adding the new Wallet
@params: {blockchainName, userAddress}
@res: 
*/
app.post("/join", (req, res) => {
    try {
        let blockName = req.body.blockchainName;
        let userAddress = req.body.userAddress;
        let genesisWallet = blockchain.wallets[3000].collectibles;
        // let userAddress = 0;
        let blockGenesis = 0;
        for (let i = 0; i < genesisWallet.length; i++) {
            if (genesisWallet[i].name == blockName) {
                // userAddress = genesisWallet[i].last + 1;
                blockGenesis = genesisWallet[i].first;
                break;
            }
        }
        if (userAddress < 3000) throw "Blockchain does not exist";
        blockchain.wallets[userAddress].collectibles.push(blockName);
        let newBlockchain = requestBlock(blockName, userAddress, blockGenesis);
        chainList.push(newBlockchain);
        fs.writeFile(
            "./src/jsons/" + blockName + ".json",
            JSON.stringify(newBlockchain),
            "utf8",
            err => {
                if (err) console.log(err);
                else console.log("Local Blockchain Created!");
            }
        );
    } catch (err) {
        console.log("Error joining blockchain: " + blockName);
        console.log(err);
    }
});

requestBlock = (blockName, userAddress, genesis) => {
    console.log("Request blockchain file");
    let body = { blockname: blockName, useraddress: userAddress };
    try {
        axios.post(address + genesis + "/request", body).then(
            res => {
                console.log("Block received by " + genesis);
                console.log(res.status);
                return res.body;
            },
            err => {
                console.log("Error: " + err);
                console.log("Retrying with next block");
                for (
                    let i = genesis + 1;
                    i != genesis;
                    i = blockchain.wallets[i].next
                ) {
                    for (
                        let j = 0;
                        j < blockchain.wallets[i].collectibles.length;
                        i++
                    ) {
                        if (blockchain.wallets[i].collectibles[j] == blockName)
                            requestBlock(blockname, userAddress, i);
                        break;
                    }
                }
            }
        );
    } catch (err) {
        console.log(err);
    }
};

app.get("/request", (req, res) => {
    try {
        let blockname = req.body.blockname;
        let userAddress = req.body.useraddress;
        console.log("Received request to join blockchain: " + blockname);
        let user = blockchain.wallets[userAddress];
        let lastBlock = chainList[blockname].last_block;
        user.next = chainList[blockname].genesis_block;
        user.collectibles = [];
        chainList[blockname].wallets[userAddress] = user;
        chainList[blockname].last_block = userAddress;
        chainList[blockname].wallets[lastBlock].next = userAddress;

        fs.writeFile(
            "./src/jsons/" + blockname + ".json",
            JSON.stringify(chainList[blockname]),
            "utf8",
            err => {
                if (err) console.log(err);
                else console.log("Local Blockchain Updated!");
            }
        );

        let managerTransaction = {
            name: "Manager",
            transaction: {
                address1: userAddress,
                address2: 3000,
                public_key1: user.public_key,
                public_key2: blockchain.wallets[3000].public_key,
                user1_value: null,
                ranking: 0,
                current_rank: 0,
                user2_value: blockname,
                isPending: false,
                isComplete: true
            }
        };
        try {
            let name = managerTransaction.name;
            let timestamp = new Date().getTime();
            let block = managerTransaction.transaction;
            block.timestamp = timestamp;
            console.log(chainList);
            block.firstHash = Block.blockHash(block);
            console.log("Creating Block: " + block.firstHash);
            block.lastHash = block.firstHash;
            chainList[name].ledger[block.firstHash] = block;
            fs.writeFile(
                "./src/jsons/" + blockname + ".json",
                JSON.stringify(chainList[blockname]),
                "utf8",
                err => {
                    if (err) console.log(err);
                    else console.log("Local Blockchain Updated!");
                }
            );
            res.status(201).send("Success");
        } catch (err) {
            console.log("Error creating block " + err);
            res.status(500).send("Error Updating File");
        }
    } catch (err) {}
});

app.post("/create", (req, res) => {
    try {
        let name = req.body.name;
        let timestamp = new Date().getTime();
        let block = req.body.transaction;
        block.timestamp = timestamp;
        console.log(chainList);
        block.firstHash = Block.blockHash(block);
        console.log("Creating Block: " + block.firstHash);
        block.lastHash = block.firstHash;
        chainList[name].ledger[block.firstHash] = block;
        fs.writeFile(
            "../jsons/" + req.body.name + ".json",
            JSON.stringify(chainList[name]),
            "utf8",
            err => {
                if (err) console.log(err);
                else console.log("Local Blockchain Updated!");
            }
        );
        res.status(201).send("Success");
    } catch (err) {
        console.log("Error creating block " + err);
        res.status(500).send("Error Updating File");
    }
});

//Receives request for a trade
//If user available, alert the front end
//Else, post a pending transaction to the ledger
app.post("/update", (req, res) => {
    try {
        let name = req.body.name;
        console.log(
            req.body.isApproved
                ? "Approving"
                : "Rejecting" + " transaction number " + req.body.transactionID
        );
        if (req.body.isApproved) {
            chainList[name].ledger[req.body.transactionID].isPending = false;
        } else {
            delete chainList[name].ledger[req.body.transactionID];
        }
        fs.writeFile(
            "../jsons/" + name + ".json",
            JSON.stringify(chainList[name]),
            "utf8",
            err => {
                if (err) console.log(err);
                else console.log("Local Blockchain Updated!");
            }
        );
    } catch (err) {
        console.log("Error Modifying Transaction: " + err);
    }
});

app.listen(PORT, () =>
    console.log(
        `Local server running on PORT: ${PORT}!\nWelcome ${myWallet.name} to the ${blockchain.name} blockchain!`
    )
);

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

checkPending = _ledger => {
    let ret = [];
    for (transaction in _ledger) {
        if (_ledger[transaction].isPending) ret.push(_ledger[transaction]);
    }
    console.log(ret.length);
    return ret;
};

checkIfItsMine = _pending => {
    let ret = [];
    for (transaction in _pending) {
        if (_pending[transaction].address2 == PORT)
            ret.push(_pending[transaction]);
    }
    console.log(ret.length);
    return ret;
};

validateTransaction = (transaction, name) => {
    console.log("Validating transaction: " + transaction.firstHash);
    if (Block.mineBlock(transaction)) {
        console.log("Block Validated");
        // transaction.currentRank = transaction.currentRank + (chainList[name].wallets.length - myWallet.ranking);
        let newHash = Block.blockHash(transaction);
        transaction.lastHash = newHash;

        if (transaction.currentRank >= transaction.ranking) {
            transaction.isComplete = true;
            chainList[name].ledger[transaction.firstHash] = transaction;
            //Update wallets
            chainList[name].wallets[transaction.address2].collectibles.push(
                transaction.user1_value
            );
            if (name !== "Manager") {
                chainList[name].wallets[transaction.address1].collectibles.push(
                    transaction.user2_value
                );
                chainList[name].wallets[transaction.address1].splice(
                    transaction.user1_value
                );
                chainList[name].wallets[transaction / address2].splice(
                    transaction.user2_value
                );
            }
        }
        fs.writeFile(
            "./src/jsons/" + name + ".json",
            JSON.stringify(chainList[name]),
            "utf8",
            err => {
                if (err) console.log(err);
                else console.log("Local Blockchain Updated!");
            }
        );
        console.log("File written!");
    } else {
        delete chainList[name].ledger[transaction];
        console.log("Invalid Transaction! Deleted from Blockchain");
    }
};

updateWallet = (transaction, name) => {};

//TODO Need a sign up function to take the private address in order to accept the PORT
