import fs from 'fs';
const read_stream = fs.createReadStream('./Bungo Stray Dogs S1 - 01.mkv')

var startTime = performance.now()

console.log('chunks:')
for await (const chunk of read_stream.iterator()) {
    ()=>{}
}
console.log('done')
var endTime = performance.now()
console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)