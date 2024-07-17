import fs from 'fs';
import type { Path } from 'typescript';
import path from "path";

var sending_file = false;
const chunk_generator: AsyncGenerator|null = null;

interface con_info {
    chunk_generator: AsyncGenerator<any, void, unknown>
}

const wss = Bun.serve<con_info>({
    async fetch(req, server) {
        // const url = new URL(req.url);
        // console.log('how to get the pathname: ', url.pathname)
        console.log('fetch server')
        const file_name = req.headers.get('filename')
        const path_name = path.resolve( __dirname, `/${file_name}`);
        const chunk_generator =  streamAnimeWebSocket(path_name);
        if (server.upgrade(req,{
            data:{
                chunk_generator : chunk_generator
            }
        })) {
            return;
        }
        return new Response("Upgrade failed", { status: 500 });
    },
    websocket: {
        open(ws) {
            console.log('websocket open');
        },
        async message(ws, message) {
            console.log('received: ', message);
            if (message.includes('receive bungo')){
                sending_file = true;
                const path_name = path.resolve( __dirname, '/Bungo Stray Dogs S1 - 01.mkv');
                const chunk_generator = await streamAnimeWebSocket(path_name);
                ws.subscribe('anime');
            }
            else if (!sending_file){
                ws.send(message);
                return;
            }
            else if (message.includes('next chunk') && sending_file){
                let next_chunk = (await ws.data.chunk_generator.next()).value
                if (next_chunk==="EOF"){
                    wss.publish('anime', next_chunk);
                    ws.close();
                    return
                }
                console.log('send next chunk');
                wss.publish('anime', next_chunk);
            }

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

async function* streamAnimeWebSocket(filename:string){
    const anime_read_stream = fs.createReadStream(filename as Path)
    for await (const chunk of anime_read_stream.iterator()) {
        yield chunk;
    }
    yield 'EOF';
}

console.log('WebSocket server started on: ', wss.url);