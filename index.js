require("dotenv").config();

const db = require('./db');

const cors = require('cors');

const express = require('express');

const app = express();

app.use(cors());

// body parsing, analizar o corpo
app.use(express.json())


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
app.get('/clientes', async (request, response) => {
    
    try {
        const results = await db.selectCustomers()
        response.status(200).json({
            message: 'Clientes obtidos com sucesso!',
            results
        });
    } catch (error) {
        response.status(500).json({
            message: 'Error ao obter clientes.'
           })
    }
    

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
