const fs = require ('fs')

module.exports = {
    //Exchenge is coins
    exchengCoin : function (coin, userNameOne, userNameTwo) {
        let userJS = JSON.parse(fs.readFileSync('./user.js')),
            userOne = userJS.find(value => value.userName == userNameOne),
            userTwo = userJs.find(value => value.userName == userNameTwo),
            mess

        if (userTwo == undefined)
            return `Мне не известен этот жрец ${userNameTwo}`
        if (isAN(+coin)) {
            if (userOne.coin < +coin) {
                return `Поднакопи еще пыли`
            } else if (userTwo.role == 'admin') {
                return `Верховный жрец не нуждается в пилы`
            } else if (coin <= 0) {
                return `@${userNameOne} передал @${userNameTwo} пустату`
            } else if (coin !== 0) {
                userJS[userOne.id].coin -= coin
                userTwo[userTwo.id].coin += coin
                mess = `@${userNameOne} передал @${userNameTwo} запечатанный сосуд с "${coin}" волшебной пылью `
            }
        }
        fs.writeFileSync('user.json', JSON.stringify(userJS), 'utf8')
        return mess
    },
    //Create new user in base
    createNewUser : function(userInfo){
        let userAll = JSON.parse(fs.readFileSync('./user.json'))
        let userFind = userAll.find(value => value.userName == userInfo.username)

        if(userFind == undefined){
            userAll.push({ id: `${userAll.length}`, userName: `${userInfo.username}`, userId: userInfo.userid, role: 'user', coin: 5 })
        }
        fs.writeFileSync('user.json', JSON.stringify(userAll), 'utf8')
        console.log(`Create New user ${userInfo.username}`)
    },
    //Accrual of dust in user
    accrualOfDust : function(userInfo,coin){
        let userAll = JSON.parse(fs.readFileSync('./user.json'))
        let userFind = userAll.find(value => value.userName == userInfo.username)
        if(userFind.role !== 'admin') userAll[userFind.id].coin += coin
        fs.writeFileSync('user.json', JSON.stringify(userAll), 'utf8')
    },
    // !dust 
    infoDust : function(userInfo){
        let userAll = JSON.parse(fs.readFileSync('./user.json'))
        let userFind = userAll.find(value => value.userName == userInfo.username)
        if(userFind == undefined) return `@${userInfo.username} хммм.... Про тебя нет информации....`
        if(userFind.role == 'admin') return `@${userInfo.username} склонюсь перед тобой создатель TheIlluminati!`
        return `@${userFind.username} у тебя ${userFind.coin} волжебной пыли PowerUpR`
    },
    //Timer
    getTime : function(time){
        time.seconds += 1
        if (time.seconds == 60) {
            time.seconds = 0
            time.minutes +=1
        }
        if (time.minutes == 60) {
            time.minutes = 0
            time.hour += 1
        }
        return time
    },
    //Single command handler
    singleCommand : function(comandsArr,comand){
        
        let cmdFind = comandsArr.find(value=>value.nameComand == comand)
        if(cmdFind == undefined) return ''
        if(cmdFind.use == false) return ''
        else return cmdFind.message
    },
    // Infomation on time
    infoTime : function(time){
        return `Стрим идет: 🕛 ${(time.hour < 9) ? "0" + time.hour : time.hour}:${(time.minutes < 9) ? "0" + time.minutes : time.minutes}:${(time.seconds < 9) ? "0" + time.seconds : time.seconds}`
    },
    // User went to stream
    addJoinerUser : function(nameUser){
        if( nameUser == 'Jin_Kat') return
        let userJoinStream = JSON.parse(fs.readFileSync('./userJoin.json'))
        userJoinStream.push({id:userJoinStream.length ,userName: nameUser})
        fs.writeFileSync('userJoin.json', JSON.stringify(userJoinStream), 'utf8')
    },
    //User exit to stream
    removeExitingUser : function(nameUser){
        if( nameUser == 'Jin_Kat') return
        let userJoinStream = JSON.parse(fs.readFileSync('./userJoin.json'))
        let userRemove = userJoinStream.find(value => value.userName == nameUser)
        if(userRemove !== undefined)
        userJoinStream.splice(userRemove.id,1)

        fs.writeFileSync('userJoin.json', JSON.stringify(userJoinStream), 'utf8')
    },
    //Passive dust extraction
    accrualPerTime : function(){
        let userJoinStream = JSON.parse(fs.readFileSync('./userJoin.json'))
        userJoinStream = userJoinStream.map((obj)=>{obj.coin += 10; return obj})
        fs.writeFileSync('userJoin.json', JSON.stringify(userJoinStream), 'utf8')
    }


}

//Type checking

function isAN(value){
    if (value instanceof Number)
    value = value.valueOf();
    return isFinite(value) && value === parseInt(value, 10);
}