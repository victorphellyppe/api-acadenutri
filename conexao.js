const mysql = require('mysql2/promise');


const conexao = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    port: 3306,
    database: 'crud',
    password: '#V1c70r@JC3'
});

module.exports =  conexao