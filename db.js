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

/** PRODUCTS */

async function insertProduct(product) {
    const values = [
        product.active,
        product.name,
        product.category,
        product.system_code,
        product.cystin_code,
        product.cost_price,
        product.sale_price,
        product.measure,
        product.amount,
        product.time_to_prepare,
        product.description,
        product.stock,
        product.datasheet,
        product.questions,
        product.observations,
        product.complements,
        product.acadenutrimobile
    ];

    const query = `
        INSERT INTO products (
            active, name, category, system_code, cystin_code, cost_price, sale_price,
            measure, amount, time_to_prepare, description, stock, datasheet, questions,
            observations, complements, acadenutrimobile
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
        )
    `;

    try {
        await client.query(query, values);
        console.log("Produto inserido com sucesso!");
    } catch (error) {
        console.error("Erro ao inserir produto:", error);
    }
}

/** Users */
async function selectUsers() {
    const results = await client.query("SELECT * FROM users;");
    return results.rows; 
}

async function login(email, senha) {
    const [results] = await client.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, senha]);
    return results;
}

// inserindo token
async function insertToken(token,dateTime) {
    console.log({
        token,
        dateTime
    });
    await client.query("INSERT INTO tokens_expirados(token, data) VALUES (?,?)", [token, dateTime]);
}

module.exports = {
    login,
    insertToken,
    selectUsers,
    insertPatient,
    selectPatients,
    selectPatient,
    selectOrders,
    selectOrder,
    insertProduct
}