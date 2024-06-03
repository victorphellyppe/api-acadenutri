const express = require('express');
const bodyParser = require('body-parser');
const db = require("../db");

const app = express();
app.use(bodyParser.json());
//obtendo
app.get('/patients', async (req,res) => {
    // console.log('Shirleise');

    try {
        const results = await db.selectPatients();
        res.status(200).json({
        message: "Pacientes obtidos com sucesso!",
        results,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
        message: "Error ao obter pacientes.",
        });
    }
});
// inserindo
app.post("/patients", async (req, res) => {
  const pacientes = req.body;
//   console.log("pacientes: ", pacientes);
  try {
    await db.insertPatient(pacientes);
    res.status(201).json({
      message: "Paciente inserido com sucesso!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error ao inserir o cliente",
    });
  }
});

app.get('/:id', async (req, res) => {
    // console.log('/PACIENTES');
    const pacienteId = parseInt(req.params.id);
      if (isNaN(pacienteId)) {
      return res.status(400).json({
        message: "ID do paciente inválido.",
      });
    }
  
    try {
      const paciente = await db.selectPatient(pacienteId);
        // console.log('dentro do try');
      // Verifica se o paciente foi encontrado
      if (!paciente) {
        return res.status(404).json({
          message: "Paciente não encontrado.",
        });
      }
  
      res.json({
        message: "Paciente obtido com sucesso!",
        paciente,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Erro ao obter paciente.",
      });
    }
});
  

function start() {
  app.listen(3002, () => {
    console.log('Nutrition service running on port 3002');
  });
}

module.exports = { start };