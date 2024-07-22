//there was no readily available syncronous prompter in native ts, so i made one
import readline from 'node:readline';
import { select, Separator } from '@inquirer/prompts';


async function chooseHost(ip_host_name: Record<string, string>) {

    return select({
        message: 'Select A host',
        choices:
            Object.keys(ip_host_name).map(ip => ({
            name: ip_host_name[ip],
            value: ip,
            description: ip
        })),
    });
}

async function chooseFolder(folder_info: Record<string, number>) {

    return select({
        message: 'Select A Folder',
        choices:
            Object.keys(folder_info).map(folder => ({
            name: folder,
            value: folder,
            description: `This folder has ${folder_info[folder]} episodes in it`
        })),
    });
}



const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

function querySync(query: string) :Promise<string> {
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans as string);
    }))
}


async function queryArraySync(queries: string[]) {
    let answers:string[] = [];
    for (const query of queries){
        // console.log('making promise')
        const answer  = await new Promise<string>(resolve => rl.question(query, ans => {
            resolve(ans as string);
        }))
        // console.log('got answer')
        answers.push(answer);
    }
    rl.close();
    return answers
}

export {querySync, queryArraySync, chooseHost, chooseFolder};