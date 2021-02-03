const tmi = require('tmi.js'),
fs = require('fs'),
options = JSON.parse(fs.readFileSync('config.json')),
client = new tmi.client(options),
ball = require('./src/8ball'),
comands = JSON.parse(fs.readFileSync('comands.json'))

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

//Join the chat
/*
client.on('join',(channel,userName,self)=>{
    if (getJoin(username))
        client.action("Jin_Cat", '@' + username + ", рад видеть тебя в чате!");
})
*/

client.on('chat',onMessageHandler)

//Main handler messages
function onMessageHandler(chanal,userInfo,msg,self){
    let usInf = JSON.parse(JSON.stringify(username).replace('user-id', 'userid'))
    //Ignore bot message
    if(self) return
    //Delete space
    let commandName = msg.trim()
    //Igrore message not with'!'
    if(commandName[0] !=='!') return

    commandName = commandName.split(' ')

    if(commandName.length >= 2) doudleMessageHandler(chanal,usInf,commandName)
    else sindleMessageHandler(chanal,usInf,commandName)


}

function doudleMessageHandler (chanal,usInf,commandName){
    let cmd = comands.map((obj)=>{
        if(obj.messageType == 'double')
        return obj
    })


}

function sindleMessageHandler (chanal,usInf,commandName){
    
}
