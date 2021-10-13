const mysql=require('mysql');

const mysqlConnection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password: '',
    database: 'teleperformance'
});

mysqlConnection.connect(function (err){
    if(err){
        console.log(err);
        return;
    }else{
        console.log('DBConnection OK');
    }
});

module.exports = mysqlConnection;