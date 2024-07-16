const socket = new WebSocket("ws://localhost:8400/chat");
import readline from 'readline';

socket.addEventListener('open', event =>
    {
        console.log('connected!');
        
    }
)

socket.addEventListener("message", event => {
    console.log(event.data);
    rl.prompt();
  })

socket.addEventListener('close', event =>
    {
        console.log('disconnected!')
        process.exit();
    }
)
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



