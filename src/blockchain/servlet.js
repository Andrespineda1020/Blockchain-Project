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

