import io from 'socket.io-client';
import readlineSync from 'readline-sync';

const userInput = readlineSync.question('Enter something: ');

console.log(`You entered: ${userInput}`);

// // CLI to send messages to all connected clients
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//     prompt: 'Message> '
//   });


// rl.prompt();


// rl.on('line', (line) => {

// })


const socket = io('http://your-websocket-server.com', {
    extraHeaders:{
        'filename':'Bungo Stray Dogs S1 - 01.mkv'
        // 'series':'',
        // 'number':''
    }
});

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('message', (data) => {
  console.log('Message from server:', data);
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});
