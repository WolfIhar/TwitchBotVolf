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
            userAll.push({ id: `${userAll.length}`, userName: `${userInfo.username}`, userId: userInfo.userid, userRole: 'user', coin: 5 })
        }
        else return
        fs.writeFileSync('user.json', JSON.stringify(userAll), 'utf8')
        console.log(`Create New user ${userInfo.username}`)
    },
    //Accrual of dust in user
    accrualOfDust : function(userInfo,coin){
        
        let userAll = JSON.parse(fs.readFileSync('./user.json'))
        let userFind = userAll.find(value => value.userName == userInfo.username)
        if(userFind.userRole !== 'admin') userAll[userFind.id].coin += coin
        else return
        fs.writeFileSync('user.json', JSON.stringify(userAll), 'utf8')
    },
    // !dust 
    infoDust : function(userInfo){
        let userAll = JSON.parse(fs.readFileSync('./user.json'))
        let userFind = userAll.find(value => value.userName == userInfo.username)
        if(userFind == undefined) return `@${userInfo.username} хммм.... Про тебя нет информации....`
        if(userFind.userRole == 'admin') return `@${userInfo.username} склонюсь перед тобой создатель TheIlluminati!`
        return `@${userFind.userName} у тебя ${userFind.coin} волжебной пыли PowerUpR`
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
        return `Время жизни: 🕛 ${(time.hour < 9) ? "0" + time.hour : time.hour}:${(time.minutes < 9) ? "0" + time.minutes : time.minutes}:${(time.seconds < 9) ? "0" + time.seconds : time.seconds}`
    },
    // User went to stream
    addJoinerUser : function(nameUser){
        if( nameUser == 'Jin_Kat') return
        let userJoinStream = JSON.parse(fs.readFileSync('./userJoin.json'))
        let userSearch = userJoinStream.find(value => value == nameUser)
        if(userSearch == undefined){
        userJoinStream.push(nameUser)
        }
        else
        return
        fs.writeFileSync('userJoin.json', JSON.stringify(userJoinStream), 'utf8')
    },
    //User exit to stream
    removeExitingUser : function(nameUser){
        if( nameUser == 'Jin_Kat') return
        let userJoinStream = JSON.parse(fs.readFileSync('./userJoin.json'))
        let userRemove = userJoinStream.find(value => value == nameUser)
        if(userRemove !== undefined)
        userJoinStream.splice(userJoinStream.indexOf(userRemove),1)
        else return

        fs.writeFileSync('userJoin.json', JSON.stringify(userJoinStream), 'utf8')
    },
    //Passive dust extraction
    accrualPerTime : function(coin){
        let userAll= JSON.parse(fs.readFileSync('./user.json'))
        let userJoinStream = JSON.parse(fs.readFileSync('./userJoin.json'))
        userAll = userAll.map((objAll)=>{
            if(objAll.userRole !== 'admin') userJoinStream.map((obj)=>{
                if(objAll.userName == obj) objAll.coin += coin;
            })
            return objAll
        })
        fs.writeFileSync('user.json', JSON.stringify(userAll), 'utf8')
    },
    //dust in thr eyes
    dustInEyes : function(userThrows,userInWhich,costDustInEyes,chanceDustInEyes,func,channal){
        let userAll = JSON.parse(fs.readFileSync('./user.json'))
        let userThrowsOne = userAll.find(value => value.userName == userThrows)
        let userInWhichOne = userAll.find(value => value.userName == userInWhich)
        if(userThrowsOne == undefined) {
            func.say(channal,`@${userThrows} тебя нет в базе данных :(`)
            return
        }
        if(userInWhichOne == undefined){
            func.say(channal,`@${userThrows} ты точно правильно ввел имя жреца? @${userInWhich} нам не известен... "Пока что"`)
            return
        }
        if(userThrowsOne.coin < cost){
            func.say(channal,`@${userThrows} иди поднакопи еще волшебной пыли`)
            return
        }
        if(chanceDustInEyes >=roll(100)){
            func.timeout(channal,userInWhich,300,`@${userThrows} кастует на тебя волшебное заклинание "Летучемышиный сглаз". Ты будешь отбиваться 5 минут :)`)
        } else {
            func.timeout(channal,userThrows,300,`@${userThrows} кастует на @${userInWhich} волшебное заклинание "Летучемышиный сглаз", но что-то пошло не так... И заклинание скастовалось на тебя:)`)
        }
        userAll[userThrowsOne.id].coin -=costDustInEyes

        fs.writeFileSync('user.json', JSON.stringify(userAll), 'utf8')
    },
    //Resset userJoin
    ressetUserJoin : function (){
        let user = []
        fs.writeFileSync('userJoin.json', JSON.stringify(user), 'utf8')
    },
    ressetUserJoin : function (){
        let user = []
        fs.writeFileSync('userJoin.json', JSON.stringify(user), 'utf8')
    },
    // !ordergame ordering a game for stream
    ordergame: (func,channal,userName,mess,glVr)=>{

        let messs  = mess.filter((value,i)=>{return i != 0})
        mess = messs
        messs = ''
        mess.forEach((item)=>{
            messs = messs+' '+item
          });
        let user = JSON.parse(fs.readFileSync('./user.json'))
        let orderGame  = JSON.parse(fs.readFileSync('./orderGame.json'))

        userFInd = user.find(value => value.userName == userName)

        if(userFInd == undefined) {func.say(channal,'Неизвестная ошибка! Попробуй еще раз <3'); return}
        if(userFInd.coin < glVr.ordergame) {func.say(channal,`У вас не хватает волшебной пыли! Тебе нужно ${glVr.ordergame}. Проверь пыль !dust`); return}
        else {
            user[userFInd.id].coin -=glVr.ordergame
            func.say(channal,`Волшебник @${userName} положил данныю карту в колоду :${messs}!`)
            orderGame.push({game:messs, user:userName})
        }

        fs.writeFileSync('user.json', JSON.stringify(user), 'utf8')
        fs.writeFileSync('orderGame.json', JSON.stringify(orderGame), 'utf8')

    },
    // !orderginfo ordering a game for stream
    orderginfo:(func,channal)=>{
        let orderGame  = JSON.parse(fs.readFileSync('./orderGame.json'))
        let ordeG = ''
        orderGame.forEach((item)=>{
            ordeG = ordeG+', '+item.game
          });
        if(orderGame.length == 0 )func.say(channal,`Колода пуста :( `)
        else
        func.say(channal,`Какие игры в колоде: ${ordeG}`)
    }

    
}

//Type checking

function isAN(value){
    if (value instanceof Number)
    value = value.valueOf();
    return isFinite(value) && value === parseInt(value, 10);
}
//Random numder
function roll(number){
    return Math.floor(Math.random()*number)+1
}