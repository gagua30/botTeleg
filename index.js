const TelegramApi = require('node-telegram-bot-api');

const token = '5183507113:AAH999_dk-pCS4aML9umIkpfdK2TXQC_RDI';

const bot = new TelegramApi(token, {
	polling: true
});
const mysql = require('mysql');

/* const conn = mysql.createConnection({
    host: "79.141.73.50",
    port: "6033",
    user: "ika30",
    database: "select_telega1",
    password: "iamlegend"
}) */

bot.on('message', msg => {
    const userId = msg.from.id; //ПОЛУЧАЕМ 
    const text = msg.text;
    const chatId = msg.chat.id;
    const nameTelegram = msg.from.username;
    let data = new Date();
    
    startSql(userId, text, chatId, nameTelegram, data);
})

function startSql(userId, text, chatId, nameTelegram, data){
    let adminName = '';
    let adminId = '';
    let k = '';
    let phone = '';
    let info = '';
    let statusUser = '';
    

    const conn = mysql.createConnection({
        host: "79.141.73.50",
        port: "6033",
        user: "ika30",
        database: "select_telega1",
        password: "iamlegend"
    })

    const query = 'SELECT * FROM `adminUser` WHERE adminUser=?'; //поиск SQL юзера
    conn.query(query, [userId], function(err, result, field){
        result.forEach(function(row) {
            adminName = row.adminName;
            adminId = row.adminUser;
          })
    
    if( userId == adminId && text.length == 11 ){
        let resQwest = "";
        console.log('Проверку  прошел');
        bot.sendMessage(chatId, 'Приветствую Вас ' + adminName );
        const query = 'SELECT * FROM `telega_2` WHERE telephone=?';
		conn.query(query, [text], function(err, result, field) {
            if (JSON.stringify(result[0]) !== undefined) { 
                    result.forEach(function(row) {
						phone = row.telephone;
                        info = row.info;
						let adres = row.adres;
						let zapros = row.zapros;
						let month = row.month;
                        statusUser = row.status;
						let b = ` ${adres} в ${month} ${zapros} раз`;
						k += b + '\n';
                        
   
				    })
                    bot.sendMessage(chatId, 'Абонент ' + phone + ' заходил на ресурсы:' + '\n' + k + '\n' + 'имеющееся информация: ' + info + '\n' + 'Роль: ' + statusUser );
                    resQwest = true;
            }else{
                    
                    bot.sendMessage(chatId,  'Абонент ' + phone +  ' не обнаружен');
                    resQwest = false;

            };
            let postData = {
                data: `${data}`,
                nameTelegram: `${nameTelegram}`, 
                idTelegram: `${userId}`, 
                adminName: `${adminName}`, 
                text: `${text}`,
                result: `${resQwest}`};
            conn.query('INSERT INTO `logBot` SET ?', [postData], function(err, result) { //ЛОГИРУЕМ ПОЛЬЗОВАТЕЛЕЙ
                console.log('The solution is: ', result);
                console.log(postData);
              });
			/* bot.sendMessage(chatId, 'Абонент ' + phone + ' заходил на ресурсы:' + '\n' + k + '\n' + 'имеющееся информация: ' + info ); */
	    })

    }else if(userId == adminId){
        bot.sendMessage(chatId, 'Приветствую Вас ' + adminName + '\n'+ ' Скорее Всего вы ввели неправильную команду'+'\n'+ 'Введите запрос в формате 7999******' );
        
    }else{
        console.log('Проверку не прошел');
        bot.sendMessage(chatId, " Если вы видете это сообщение, то значит у Вас нет доступа." +'\n'+ "Обратитесь к администратору для предоставления прав.");

        let postData = {
            data: `${data}`,
            nameTelegram: `${nameTelegram}`, 
            idTelegram: `${userId}`, 
            text: `${text}`,
            };
        conn.query('INSERT INTO `logUser` SET ?', [postData], function(err, result) { //ЛОГИРУЕМ ПОЛЬЗОВАТЕЛЕЙ
            console.log('The solution is: ', result);
            console.log(postData);
          });
    }

})

}