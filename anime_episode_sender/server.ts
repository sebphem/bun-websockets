import fs from 'fs';
import type { Path } from 'typescript';
import path from "path";

interface con_info {
    chunk_generator: AsyncGenerator<any, void, unknown>
}

const wss = Bun.serve<con_info>({
    async fetch(req, server) {
        const url = new URL(req.url);
        const file_name = url.searchParams.get('filename');
        if (file_name === null) {
            return new Response("no filename present", { status: 400 });
        }
        const decodedFileName = decodeURIComponent(file_name);
        console.log('dirname: ', __dirname)
        const path_name = path.resolve(`${__dirname}\\${decodedFileName}`);
        console.log(path_name);
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
        async open(ws) {
            console.log('websocket open');
            let next_chunk = (await ws.data.chunk_generator.next()).value
            ws.send(next_chunk)
        },
        async message(ws, message) {
            await new Promise(r => setTimeout(r, 10));
            console.log('received: ', message);
            if (message.includes('next chunk')){
                let next_chunk = (await ws.data.chunk_generator.next()).value
                if (next_chunk==="EOF"){
                    ws.send(next_chunk);
                    ws.close();
                    return
                }
                console.log('send next chunk');
                ws.send(next_chunk);
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