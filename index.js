const tmi = require('tmi.js'),
fs = require('fs'),
options = JSON.parse(fs.readFileSync('config.json')),
client = new tmi.client(options)

//Time
let time = [{
    seconds: 0,
    minutes: 0,
    hour: 0
}]

//Connect to twitch
client.connect().then((data)=>{
    console.log(`Connected to ${data[0]}:${data[1]}`)
}).catch((err)=>{
    console.log(`${err}`)
})

setInterval(setTime, 1000)