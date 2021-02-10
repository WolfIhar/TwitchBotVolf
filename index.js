const tmi = require('tmi.js'),
fs = require('fs'),
options = JSON.parse(fs.readFileSync('config.json')),
ball = require('./src/8ball'),
comands = JSON.parse(fs.readFileSync('comands.json')),
cmds = require('./src/commands'),
glVr =JSON.parse(fs.readFileSync('globalVariables.json'))

const client = new tmi.client(options)
//Time
var time = {
    seconds: 0,
    minutes: 0,
    hour: 0
}

//Connect to twitch
client.connect().then((data)=>{
    console.log(`Connected to ${data[0]}:${data[1]}`)
}).catch((err)=>{
    console.log(`${err}`)
})

setInterval(()=>time = cmds.getTime(time),1000)
setInterval(cmds.accrualPerTime(),(glVr*60)*1000)


client.on('join',(channel,username,self)=>{
    cmds.addJoinerUser(username)
})
client.on('part',(channel,username,self)=>{
    cmds.removeExitingUser(username)
})


client.on('chat',onMessageHandler)

//Main handler messages
function onMessageHandler(chanal,userInfo,msg,self){
    console.log(1)
    accrualOfDust(userInfo.username,1)
    let usInf = JSON.parse(JSON.stringify(userInfo).replace('user-id', 'userid'))
    //Ignore bot message
    if(self) return
    //Delete space
    let commandName = msg.trim()
    //Igrore message not with'!'
    if(commandName[0] !=='!') return

    commandName = commandName.split(' ')

    if(commandName.length >= 2) doudleMessageHandler(chanal,usInf.username,commandName)
    else sindleMessageHandler(chanal,usInf.username,commandName)


}

function doudleMessageHandler (chanal,usInf,commandName){
    switch(commandName[0]){
        case '!8ball':
            client.say(chanal,ball(usInf))
            break
        case '!swap':
            client.say(chanal,cmds.exchengCoin(commandName[2],usInf,commandName[1]))
            break
        case '!spell':
            cmds.dustInEyes(usInf,commandName[1],glVr.costDustInEyes,glVr.chanceDustInEyes,client,chanal)
            break
    }
}

function sindleMessageHandler (chanal,usInf,commandName){
    switch(commandName[0]){
        case '!dust':
            client.say(chanal,cmds.infoDust(usInf))
            break
        case '!time':
            client.say(chanal,cmds.infoTime(time))
            break
        default:
            let sCom = cmds.singleCommand(comands,commandName[0])
            if('' !== sCom) client.say(chanal,sCom)
            break
    }
}
