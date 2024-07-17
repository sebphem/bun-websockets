import io from 'socket.io-client';
import fs from 'fs';
const writeStream = fs.createWriteStream('./literary_stray_dog.mkv');

const socket = io('localhost:8400', {
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
    data
    if (data === 'EOF') {
      console.log('end of file')
      socket.close();
      writeStream.close();
  } else {
      writeStream.write(data);
      socket.send('next chunk');
  }
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});
