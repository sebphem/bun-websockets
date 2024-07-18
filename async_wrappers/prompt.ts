//there was no readily available syncronous prompter in native ts, so i made one
import readline from 'node:readline';

const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

function querySync(query: string) {
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans as String);
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

export {querySync, queryArraySync};