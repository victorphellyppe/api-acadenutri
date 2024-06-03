const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '#V1c70r@JC3',
    database: 'acadenutri',
    port: 5432,
});

pool.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados PostgreSQL:', err.stack);
        return;
    }
    console.log('Conexão com o banco de dados PostgreSQL estabelecida com sucesso!');

    // Iniciar o servidor da aplicação após conectar ao banco de dados
    app.listen(process.env.PORT, () => {
        console.log('App is running! (conexao.js)');
    });
});


module.exports = pool;
