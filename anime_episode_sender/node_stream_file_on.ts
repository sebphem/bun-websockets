import fs from 'fs';
const read_stream = fs.createReadStream('./Bungo Stray Dogs S1 - 01.mkv')

var startTime = performance.now()


//do nothing with the data
read_stream.on('data', (chunk) => {
    () =>{}
  })

//once we're done with the file
read_stream.on("end", ()=>{
    console.log('file is over');
    const endTime = performance.now()
    console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)
})
