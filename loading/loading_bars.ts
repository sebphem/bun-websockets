import loading from 'loading-cli';
const load = loading("loading text!!").start()

function getRandomIndex(array: any[]): number {
    return Math.floor(Math.random() * array.length);
}


setTimeout(function(){
    load.color = 'yellow';
    load.text = ' Loading rainbows';
},2000)

// stop
setTimeout(function(){
    load.stop()
},10000)