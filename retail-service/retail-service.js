const express = require('express');
const bodyParser = require('body-parser');
const db = require('../db');

const app = express();
app.use(bodyParser.json());

app.get('/:orderNumber', async (req, res) => {
    const order_number = req.params.orderNumber;
    if (isNaN(order_number)) {
        return res.status(400).json({
        message: "Ordem inválida.",
        });
    }
    try {
      const order = await db.selectOrder(order_number);
      if (!order) {
        return res.status(404).json({
          message: "Ordem não encontrada.",
        });
      }
      res.json({
        message: "Ordem obtida com sucesso!",
        order,
      }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erro ao obter ordem.",
        });
    }
});

app.get('/', async (req, res) => {
    try {
        const results = await db.selectOrders();
        res.status(200).json({
        message: "Ordens obtidas com sucessoO!",
        results,
        });
    } catch (e) {
        console.error(e);
        throw e;
    }
    db.selectOrders();
    console.log('Rees');
})

function start() {
  app.listen(3003, () => {
    console.log('Retail service running on port 3003');
  });
}

module.exports = { start };