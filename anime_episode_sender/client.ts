import readline from 'readline';
import fs from 'fs';

const file_name = "Bungo Stray Dogs S1 - 01.mkv";

const socket = new WebSocket(`ws://localhost:8400?filename=${encodeURIComponent(file_name)}`);
const writeStream = fs.createWriteStream('./literary_stray_dog.mkv');

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
        socket.send('next chunk')
    }
  })

socket.addEventListener('close', event =>
    {
        console.log('disconnected!')
        process.exit();
    }
)

// socket.send('asdfsadfsadf')

// CLI to send messages to all connected clients
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Message> '
  });


rl.prompt();


rl.on('line', (line) => {
    socket.send(line);
    rl.prompt();
  }).on('close', () => {
    console.log('Exiting...');
    process.exit(0);
  });



