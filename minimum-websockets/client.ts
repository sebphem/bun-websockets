import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { querySync } from '../user_input/prompt';
import { getIpsWithOpenPort, getHostNameFromIP, getMachineCidr, getIpsandHostName}  from '../pinger/utils';
import { chooseHost,  chooseFolder} from '../user_input/prompt';


// const base_folder = await querySync('What is the base folder?');

const base_folder = "C:\\Users\\sebas\\Documents\\websocket_server"

const all_local_ips = getIpsandHostName(8400);

const ip = await chooseHost(all_local_ips);

let url = new URL(`http://localhost:8400`)
url.pathname = 'getFileInfo';

let res =  await fetch(url.toString())
if (!res.ok) {
    console.error('are you sure the server is running?')
    console.error(res.statusText);
    console.error(res.body);
}
const server_folder_info: Record<string,number> = await res.json();


const chosen_folder = await chooseFolder(server_folder_info);


async function downloadEntireFolder(dir_name: string) {
    const num_episodes = server_folder_info[dir_name]
    try {
        fs.mkdirSync(path.join(base_folder, chosen_folder))
    } catch {}
    
    for (let i = 0; i < 1; i++){
        console.log("starting episode: ", i + 1);
        const socket = new WebSocket(`ws://localhost:8400/animews?dir_name=${encodeURIComponent(dir_name)}&ep_num=${i}`);
        console.log('path: ', path.resolve( base_folder,`${dir_name}`,`${i + 1}.mkv`))
        const writeStream = fs.createWriteStream(path.resolve(base_folder, `${dir_name}`, `${i + 1}.mkv`));
        socket.addEventListener('open', event =>
            {
                console.log('connected!');
            }
        )

        socket.addEventListener("message", event => {
            console.log('message!')
            if (event.data === 'EOF') {
                console.log('end of file')
                socket.close();
                writeStream.close();
            } else {
                writeStream.write(event.data);
                console.log()
                socket.send('next chunk')
            }
        })


        let res = await new Promise((resolve,reject): void=>  {
            socket.addEventListener('close', event =>
            {
                console.log('disconnected!')
                resolve(0);
            }
        )
        })
        console.log(res)
    }
}

await downloadEntireFolder(chosen_folder)