require("dotenv").config();

const db = require('./db');

const cors = require('cors');


const express = require('express');

const jwt = require('jsonwebtoken');

const app = express();


app.use(cors());

// body parsing, analizar o corpo
app.use(express.json())

function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    const index = blackList.findIndex(item => item === token);
    if(index !== -1) return res.status(401).json({message: 'Faça login novamente'}).end();
    
    //podendo trabalhar com async await ou callbacks, seguindo o exemplo com callback
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if(err) return res.status(401).end();

        req.userId = decoded.userId
        next();
    });
    
}

// diferença de put vs patch
// put - atualiza a entidade inteira.
// patch - atualiza os campos.

app.patch("/clientes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const customer = req.body;
    try {
        await db.updateCustomer(id, customer);
        res.status(200).json({
            message: 'Cliente editado com sucesso!'
        }) 
    } catch (error) {
        res.status(500).json({
            message: 'Error ao editar cliente.'
           })
    }
});

app.delete("/clientes/:id", async(req, res) => {
    const id = parseInt(req.params.id);
    try {
        await db.deleteCustomer(id);
        res.status(204).json({
            message: 'Cliente deletado com sucesso!'
        });
    } catch (e) {
       res.status(500).json({
        message: 'Error ao deletar cliente.'
       })
    }
});
//  inserindo dados no db
app.post("/clientes", async (req, res) => {
    const customer = req.body;
    console.log('Customer: ', customer);
    try {
        await db.insertCustomer(customer);
        res.status(201).json({
            message: 'Cliente inserido com sucesso!'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error ao inserir o cliente'
        });
    }
});
//  obtendo todos os dados do db
app.get('/clientes', verifyJWT, async (req, res) => {
    console.log(req.userId + ' fez esta chamada!');
    try {
        const results = await db.selectCustomers();
        res.status(200).json({
            message: 'Clientes obtidos com sucesso!',
            results
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error ao obter clientes.'
        });
    }
});

// app.post('/login', async (req, res) => {
//     // aqui vou no banco verifico se existe e entro no if
//     console.log(req.body, 'Req.body')
//     if(req.body.user === 'luiz' && req.body.password === '123') {
//         const token = jwt.sign({userId: 1}, process.env.SECRET, { expiresIn: 300 })
//         return res.json({ auth: true, token });
//     }
//     // const nome = parseInt(req.params.nome);

//     const results = await db.selectCustomers();
//     response.status(200).json({
//         message: 'Clientes obtidos por nome  com sucesso!',
//         results
//     });

//     res.status(401).json({ message: "Não foi possivel fazer o login. "}).end();
// });
app.post('/login', async (req, res) => {
    // aqui vou no banco verifico se existe e entro no if
    const { usuario, senha } = req.body;
    
    const results = await db.selectUserForLogin(usuario, senha);
    console.log(results,'results para userID');
    if(results.length > 0) {
        const token = jwt.sign({userId: 1}, process.env.SECRET, { expiresIn: 300 })
        return res.status(200).json({ 
            auth: true, 
            token,
            message: "Login efetuado com sucesso!"
        });
    }
    res.status(401).json({ message: "Não foi possivel efetuar o login. "}).end()
    return results;
});

app.post('/logout', (req, res) => {
    const dateTime = new Date();
    db.insertToken(req.headers['x-access-token'], dateTime);
    res.end();
});

// obtendo dado especifico do db
app.get("/clientes/:id", async (req,res) => {
    const id = parseInt(req.params.id);
    try {
        const results = await db.selectCustomer(id);
        res.json({
            message: 'Cliente obtido com sucesso!',
            results
        })  
    } catch (error) {
        res.status(500).json({
            message: 'Error ao obter cliente.'
           })
    }
    
});


app.get("/", (req,res) => {
    res.json({
        message: "Conseguiu acessar a raiz."
    });
});



app.listen(process.env.PORT, () => {
    console.log('App is running!');
});
