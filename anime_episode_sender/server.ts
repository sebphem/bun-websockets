import fs from 'fs';


const wss = Bun.serve({
    fetch(req, server) {
        // const url = new URL(req.url);
        // console.log('how to get the pathname: ', url.pathname)
        console.log('fetch server')

        // upgrade the request to a WebSocket
        if (server.upgrade(req)) {
            return; // do not return a Response
        }
        return new Response("Upgrade failed", { status: 500 });
    },
    websocket: {
        open(ws) {
            console.log('websocket open');
            // ws.send('welcome to the server!');
        }, // a socket is opened
        async message(ws, message) {
            console.log('received: ', message)
            if (message.includes('receive bungo')){
                ws.subscribe('anime');
                await streamAnimeWebSocket();
                console.log('sent file')
                ws.close();
            }
            ws.send(message)

        }, // a message is received
        close(ws, code, message) {
            console.log('connection closed')
        }, // a socket is closed
        drain(ws) {}, // the socket is ready to receive more data
        idleTimeout:180, //wait 3 minutes to close the connection
    }, // handlers
    port:8400,
    hostname:"0.0.0.0",

  });


async function streamAnimeWebSocket(){

    const anime_read_stream = fs.createReadStream('./Bungo Stray Dogs S1 - 01.mkv')
    for await (const chunk of anime_read_stream.iterator()) {
        wss.publish('anime', chunk)
        await new Promise(r => setTimeout(r, 10));
    }
    wss.publish('anime', 'EOF');
}

console.log('WebSocket server started on: ', wss.url);