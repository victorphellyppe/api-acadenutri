const express = require('express');
const bodyParser = require('body-parser');
const db = require("../db");

const app = express();
app.use(bodyParser.json());

app.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const results = await db.selectUsers();
    res.status(200).json({
      message: "Usuários obtidos com sucesso!",
      results,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error ao obter clientes.",
    });
  }
//   res.send({ id: userId, name: 'John Doe' });
});

function start() {
  app.listen(3001, () => {
    console.log('User service running on port 3001');
  });
}

module.exports = { start };