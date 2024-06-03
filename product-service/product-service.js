const db = require('../db');
const express = require('express');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());

app.post("/", async (req, res) => {
    const products = req.body;
  //   console.log("pacientes: ", pacientes);
    try {
      await db.insertProduct(products);
      res.status(201).json({
        message: "Produtos inserido com sucesso!",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error ao inserir o produto.",
      });
    }
});

function start() {
    app.listen(3007, () => {
      console.log('Retail service running on port 3003');
    });
  }
  
module.exports = { start };