/*
File responsible for operating P2P communications such as
- Request for trade
- Check who is online (?) TODO verify and think about this
- ... to think about more actions


Transaction flow:
- User A sends request to B
- B accepts A request
- Common ancestor C is found
- C receives A and B's JSON
- C validates the JSON
- C updates its JSON and populates to the branches

Resources:
https://blog.logrocket.com/beyond-rest-using-websockets-for-two-way-communication-in-your-react-app-884eff6655f5/
https://blog.bitlabstudio.com/a-simple-chat-app-with-react-node-and-websocket-35d3c9835807?gi=166497398e7e
https://www.valentinog.com/blog/socket-react/
https://itnext.io/building-a-node-js-websocket-chat-app-with-socket-io-and-react-473a0686d1e1
*/

const app = require('express')();
const bodyParser = require('body-parser');
const httpServer = require('http').Server(app);
const axios = require('axios');
const io = require('socket.io')(httpServer);
const client = require('socket.io-client');
const operations = require('./operations');

// const BlockChain = require('./models/chain');
const SocketActions  = require('./actions');

const socketListeners = require('./socketListeners');

const PORT = process.env.PORT || 3000;

// const blockChain = new BlockChain(null, io);

app.use(bodyParser.json());

app.post('/nodes', (req, res) => {
  const { host, port } = req.body;
  const { callback } = req.query;
  const node = `http://${host}:${port}`;
  const socketNode = socketListeners(client(node), blockChain);
//   blockChain.addNode(socketNode, blockChain);
  if (callback === 'true') {
    console.info(`Added node ${node} back`);
    res.json({ status: 'Added node Back' }).end();
  } else {
    axios.post(`${node}/nodes?callback=true`, {
      host: req.hostname,
      port: PORT,
    });
    console.info(`Added node ${node}`);
    res.json({ status: 'Added node' }).end();
  }
});

app.post('/transaction', (req, res) => {
  const { sender, receiver, amount } = req.body;
  io.emit(SocketActions.ADD_TRANSACTION, sender, receiver, amount);
  res.json({ message: 'transaction success' }).end();
});

app.get('/chain', (req, res) => {
//   res.json(blockChain.toArray()).end();
});

app.post('/request', (req, res) => {
    const {message} = req.body;
    io.emit(SocketActions.REQUEST_TRADE, message);
    res.json({response: res.message}).end();
});

io.on('connection', (socket) => {
  console.info(`Socket connected, ID: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`Socket disconnected, ID: ${socket.id}`);
  });
});

// blockChain.addNode(socketListeners(client(`http://localhost:${PORT}`), blockChain));

httpServer.listen(PORT, () => console.info(`Express server running on ${PORT}...`));