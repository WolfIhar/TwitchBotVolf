const { KeyObject } = require('crypto')

const tmi = require('tmi.js'),
fs = require('fs'),
options = JSON.parse(fs.readFileSync('config.json')),
ball = require('./src/8ball'),
comands = JSON.parse(fs.readFileSync('comands.json')),
cmds = require('./src/commands'),
glVr =JSON.parse(fs.readFileSync('globalVariables.json'))

const client = new tmi.client(options)
//Time time

cmds.ressetUserJoin()
//Connect to twitch
client.connect().then((data)=>{
    console.log(`Connected to ${data[0]}:${data[1]}`)
}).catch((err)=>{
    console.log(`${err}`)
})

setInterval(()=>cmds.accrualPerTime(glVr.coinAccrual),(glVr.ticTime*60)*1000)


client.on('join',(channel,username,self)=>{
    cmds.addJoinerUser(username)
})
client.on('part',(channel,username,self)=>{
    cmds.removeExitingUser(username)
})


client.on('chat',onMessageHandler)

//Main handler messages
function onMessageHandler(chanal,userInfo,msg,self){
    let usInf = JSON.parse(JSON.stringify(userInfo).replace('user-id', 'userid'))
    cmds.createNewUser(usInf)
    cmds.accrualOfDust(userInfo,glVr.coin)

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
    switch(commandName[0]){
        case '!8ball':
            client.say(chanal,ball(usInf.username))
            break
        case '!swap':
            client.say(chanal,cmds.exchengCoin(commandName[2],usInf.username,commandName[1]))
            break
        case '!spell':
            cmds.dustInEyes(usInf.username,commandName[1],glVr.costDustInEyes,glVr.chanceDustInEyes,client,chanal)
            break
        case '!ordergame':
            cmds.ordergame(client,chanal,usInf.username,commandName,glVr)
    }
}

function sindleMessageHandler (chanal,usInf,commandName){
    switch(commandName[0]){
        case '!dust':
            client.say(chanal,cmds.infoDust(usInf))
            break
        case '!orderginfo':
            cmds.orderginfo(client,chanal)
            break
        default:
            let sCom = cmds.singleCommand(comands,commandName[0])
            if('' !== sCom) client.say(chanal,sCom)
            break
    }
}
