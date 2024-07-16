import readline from "readline";

interface Userdata {
    userName: string,
}

const wss = Bun.serve<Userdata>({
    fetch(req, server) {
        // const url = new URL(req.url);
        // console.log('how to get the pathname: ', url.pathname)

        // upgrade the request to a WebSocket
        if (server.upgrade(req)) {
            return; // do not return a Response
        }
        return new Response("Upgrade failed", { status: 500 });
    },
    websocket: {
        open(ws) {
            ws.send('welcome to the server!');
            ws.subscribe('chat');
        }, // a socket is opened
        message(ws, message) {
            ws.send(message)
        }, // a message is received
        close(ws, code, message) {
            console.log('connection closed')
        }, // a socket is closed
        drain(ws) {}, // the socket is ready to receive more data
        idleTimeout:180, //wait 3 minutes to close the connection
    }, // handlers
    port:8400,
    passphrase:"james",
  });



console.log('WebSocket server started on: ', wss.url);

// CLI to send messages to all connected clients
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Message> '
  });

rl.prompt();

// rl.on('line', (line) => {
//         wss.publish("chat", line);
//         rl.prompt();
//     }).on('close', () => {
//         console.log('Exiting...');
//         process.exit(0);
//     });