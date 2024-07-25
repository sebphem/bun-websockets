import fs from 'fs';
import type { Path } from 'typescript';
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import { querySync } from '../user_input/prompt';

interface con_info {
    chunk_generator: AsyncGenerator<any, void, unknown>
}

const wss = Bun.serve<con_info>({
    async fetch(req, server) {
        console.log('received req')
        const url = new URL(req.url);
        console.log('url: ', url.toString())
        console.log(url.pathname)
        switch (url.pathname) {
            case '/getFileInfo':
                console.log(JSON.stringify(base_folder_subfolder_dict))
                return new Response(JSON.stringify(base_folder_subfolder_dict), { status: 200 });
            case '/animews':
                console.log('animews')
                const dir_name = url.searchParams.get('dir_name');
                const ep_num = Number(url.searchParams.get('ep_num'));
                if (dir_name === null) {
                    return new Response("no filename present", { status: 400 });
                }
                else if (ep_num === null) {
                    return new Response("no episode number present", { status: 400 });
                }

                const decodeddirname = decodeURIComponent(dir_name);
                console.log('dir name : ', decodeddirname)
                console.log('episode number: ', ep_num + 1);
                const anime_dir_name = path.resolve(`${base_folder}\\${decodeddirname}`);
                console.log('anime dir name: ', anime_dir_name)
                const file_path = getNthFileNameInDir(anime_dir_name, ep_num)
                console.log('assumed file path: ', file_path)
                const chunk_generator =  streamAnimeWebSocket(file_path);

                //try upgrading the server
                if (server.upgrade(req,{
                    data: {
                        chunk_generator: chunk_generator
                    }
                })) {
                    return;
                }
                return new Response("Upgrade failed", { status: 500 });
                
            default:
                console.log('unknown pathname: ', url.pathname)
                return new Response("idk what youre trying to do. I give up.", {status : 300})

        }
    },
    port: 8400,
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
                if (next_chunk === "EOF") {
                    console.log('sending last chunk')
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
        idleTimeout:180,
    }
    // tls: {
    //     key: Bun.file(__dirname + "\\..\\keys\\key.pem"),
    //     cert: Bun.file(__dirname + "\\..\\keys\\cert.pem"),
    //     passphrase: "8400",
    // }
  });

function getDictOfFilesInEachSubFolder(dir_path: Path | string): Record<string, number>{
    let folders_info: Record<string,number> = {};
    const files = fs.readdirSync(dir_path);
    files.forEach(file => {
        const dirPath = path.join(dir_path, file);
        if (fs.statSync(dirPath).isDirectory()) {
            let num_files = getNumFilesInFolder(dirPath);
            folders_info[file] = num_files;
        }
    });
    return folders_info;
}

function getNthFileNameInDir(dir_path: Path | string, n: number): string {
    let fileNumber = 0;

    const files = fs.readdirSync(dir_path);
    console.log('num of files at ', dir_path, ' : ',files.length)
    for (const file of files){
        const filePath = `${dir_path}\\${file}`;
        console.log('file path: ', filePath, ' is a file')
        if (fs.statSync(filePath).isFile()) {
            if (n === fileNumber) {
                console.log('found the nth value, returning ', file)
                return filePath;
            }
            fileNumber++;
            console.log('filenumber value: ', fileNumber)
        }
    }
    return 'out of range';
}

function getNumFilesInFolder(dir_path : Path | string): number{
    let fileCount = 0;

    const files = fs.readdirSync(dir_path);
    files.forEach(file => {
        const filePath = path.join(dir_path, file);
        if (fs.statSync(filePath).isFile()) {
        fileCount++;
        }
    });
    return fileCount;
}


async function* streamAnimeWebSocket(filename:string){
    const anime_read_stream = fs.createReadStream(filename as Path)
    for await (const chunk of anime_read_stream.iterator()) {
        yield chunk;
    }
    yield 'EOF';
}
// const base_folder = await querySync('what is the base folder?');
const base_folder = "C:\\Users\\sebas\\Documents\\anime"
const base_folder_subfolder_dict = getDictOfFilesInEachSubFolder(base_folder);
console.log('WebSocket server started on: ', wss.url);
