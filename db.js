require("dotenv").config();
const { Pool } = require('pg');


console.log("Tentando se conectar ao banco de dados...");

const client = new Pool({
    host: process.env.HOST_DB,
    user: 'postgres',
    password: '#V1c70r@JC3',
    database: 'acadenutri',
    port: 5432,
});

client.on('connect', () => {
    console.log('Conexão com o banco de dados PostgreSQL estabelecida com sucesso!');
});

client.on('error', (err) => {
    console.error('Erro ao conectar ao banco de dados:', err);
});

/** PACIENTES  */

// insert patient
async function insertPatient(patient) {
    const values = [
        patient.name, 
        patient.email, 
        patient.dateofbirth, 
        patient.gender, 
        patient.phone, 
        patient.maritalstatus, 
        patient.profession, 
        patient.cpf, 
        patient.address, 
        patient.cep, 
        patient.number, 
        patient.complement, 
        patient.state,
        patient.city,
        patient.neighborhood,
        patient.patientpermission,
        patient.receipts,
        patient.materials,
        patient.timestamp,
        patient.country,
    ];
    await client.query("INSERT INTO patients(name,email,dateofbirth,gender,phone,maritalstatus,profession,cpf,address,cep,number,complement,state,city,neighborhood,patientpermission,receipts,materials,timestamp,country) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)", values);
}  

// select all patients
async function selectPatients() {
    const results = await client.query("SELECT * FROM patients;");
    return results.rows; 
}

//select patients por id
async function selectPatient(id) {
    const results = await client.query("SELECT * FROM patients WHERE id=$1;", [id]);
    // return results[0];
    return results.rows; 

}

/** ORDERS */

async function selectOrders() {
    console.log('selectOrders');
    try {
        const results = await client.query("SELECT * FROM orders;");
        return results.rows;
    } catch (e) {
        console.error('Erro ao buscar pedidos:', e);
        throw e;
    } 

}
async function selectOrder(orderNumber) {
    try {
        const results = await client.query("SELECT * FROM orders WHERE order_number=$1;", [orderNumber]);
        return results.rows;
    } catch (e) {
        console.error('Erro ao buscar pedidos:', e);
        throw e;
    } 

}

// indo no banco obter os dados
async function selectUsers() {
    const results = await client.query("SELECT * FROM users;");
    return results.rows; 
}













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
    insertToken,
    selectUsers,
    insertPatient,
    selectPatients,
    selectPatient,
    selectOrders,
    selectOrder
}