const fs = require('fs')
let ballMessages = JSON.parse(fs.readFileSync('./8ball.json'))

function getBallMess(userName){
    return `@${userName}, ${ballMessages[roll()].mess}`
}

function roll(){
    return Math.floor(Math.random()*ballMessages.length)
}

module.exports = getBallMess;