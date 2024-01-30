require("dotenv").config();

const db = require('./db');

const express = require('express');

const app = express();

// body parsing, analizar o corpo
app.use(express.json())

// diferença de put vs patch
// put - atualiza a entidade inteira.
// patch - atualiza os campos.

app.patch("/clientes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const customer = req.body;
    await db.updateCustomer(id, customer);
    res.sendStatus(200);
});

app.delete("/clientes/:id", async(req, res) => {
    const id = parseInt(req.params.id);
    await db.deleteCustomer(id);
    res.sendStatus(204);
});
//  inserindo dados no db
app.post("/clientes", async (req, res) => {
    const customer = req.body;
    await db.insertCustomer(customer);
    res.sendStatus(201);
});
//  obtendo todos os dados do db
app.get('/clientes', async (request, response) => {
    const results = await db.selectCustomers()
    response.json(results);
});
// obtendo dado especifico do db
app.get("/clientes/:id", async (req,res) => {
    const id = parseInt(req.params.id);
    const results = await db.selectCustomer(id);
    res.json(results);
});


app.get("/", (req,res) => {
    res.json({
        message: "Conseguiu acessar a raiz."
    });
});



app.listen(process.env.PORT, () => {
    console.log('App is running!');
});
