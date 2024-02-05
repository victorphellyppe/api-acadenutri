const mysql = require('mysql2/promise');

// const client = mysql.createPool(process.env.CONNECTION_STRING);
//  criando um pool de conexoes para não precisar abrir e fechar a conexao melhorando a performance
const client = mysql.createPool({
    connectionLimit: 10, // Número máximo de conexões no pool
    host: 'localhost', // ou '127.0.0.1' se estiver local
    user: 'root',
    password: '#V1c70r@JC3',
    database: 'crud'
  });


// indo no banco obter cliente especifico para login
async function selectUserForLogin(usuario, senha) {
    const [results] = await client.query("SELECT * FROM clientes WHERE usuario = ? AND senha = ?", [usuario, senha])
    return results;
}
// indo no banco obter os dados
async function selectCustomers() {
    const results = await client.query("SELECT * FROM clientes;");
    return results[0];
}
// indo no banco obter cliente especifico
async function selectCustomer(id) {
    const results = await client.query("SELECT * FROM clientes WHERE id=?;", [id])
    return results[0];
}
// inserindo cliente
async function insertCustomer(cliente) {
    const values = [cliente.nome, cliente.idade, cliente.uf, cliente.usuario, cliente.senha];
    await client.query("INSERT INTO clientes(nome,idade,uf) VALUES (?,?,?)", values);
}
// inserindo token
async function insertToken(token,dateTime) {
    console.log({
        token,
        dateTime
    });
    await client.query("INSERT INTO tokens_expirados(token, data) VALUES (?,?)", [token, dateTime]);
}
// atualizando cliente passando id
async function updateCustomer(id, cliente) {
    const values = [cliente.nome, cliente.idade, cliente.uf, id]
    await client.query("UPDATE clientes SET nome=?,idade=?,uf=? WHERE id=?", values);
}
// deletando cliente
async function deleteCustomer(id) {
    const values = [id]
    await client.query("DELETE FROM clientes WHERE id=?", values);
}
module.exports = {
    selectCustomers,
    selectCustomer,
    insertCustomer,
    updateCustomer,
    deleteCustomer,
    selectUserForLogin,
    insertToken
}