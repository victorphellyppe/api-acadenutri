require("dotenv").config();

const db = require('./db');

const express = require('express');

const app = express();

// body parsing, analizar o corpo
app.use(express.json())

// diferença de put vs patch
// put - atualiza a entidade inteira.
// patch - atualiza os campos.

app.patch("/clientes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const customer = req.body;
    db.updateCustomer(id, customer);
    res.sendStatus(200);
})

app.delete("/clientes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    db.deleteCustomer(id);
    res.sendStatus(204);
});
app.post("/clientes", (req, res) => {
    const customer = req.body;
    db.insertCustomer(customer);
    res.sendStatus(201);
})

app.get('/clientes', (request, response) => {
    response.json(db.selectCustomers())
});

app.get("/clientes/:id", (req,res) => {
    const id = parseInt(req.params.id);
    res.json(db.selectCustomer(id))
})


app.get("/", (req,res) => {
    res.json({
        message: "Conseguiu."
    });
});



app.listen(process.env.PORT, () => {
    console.log('App is running!');
});
