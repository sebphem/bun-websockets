console.log('starting conversion');
const readable_stream = Bun.file('./Bungo Stray Dogs S1 - 01.mkv').stream()
console.log('p1 done');
const arrBuf = await Bun.readableStreamToArrayBuffer(readable_stream);
console.log('p2 done');
const nodeBuf = Buffer.from(arrBuf);
console.log('p3 done');

var startTime = performance.now()
console.log('chunks:')

for await (const chunk of nodeBuf) {
    ()=>{}
}
console.log('done')
var endTime = performance.now()
console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)