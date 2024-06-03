require("dotenv").config();
const db = require("./db");
const cors = require("cors");
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');


app.use(cors());
app.use(express.json());
function verifyJWT(req, res, next) {
  const token = req.headers["x-access-token"];
  const index = blackList.findIndex((item) => item === token);
  if (index !== -1)
    return res.status(401).json({ message: "Faça login novamente" }).end();

  //podendo trabalhar com async await ou callbacks, seguindo o exemplo com callback
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) return res.status(401).end();

    req.userId = decoded.userId;
    next();
  });
}

/** ENDPOINT PRA TESTAR O SERVIDOR */
app.get("/test", (req, res) => {
    res.send('Servidor está funcionando!');
});

/** USER */
app.get("/users", async (req, res) => {
    // console.log(req.userId + " fez esta chamada!");    // res.send('Opaa')
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
});

app.get('/patients', async (req,res) => {
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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const results = await db.login(email, password);
  console.log(results, "results para userID");
  if (results.length > 0) {
    const token = jwt.sign({ userId: 1 }, process.env.SECRET, {
      expiresIn: 300,
    });
    return res.status(200).json({
      auth: true,
      token,
      message: "Login efetuado com sucesso!",
    });
  }
  res.status(401).json({ message: "Não foi possivel efetuar o login. " }).end();
  return results;
});

const blackList = [];

app.post("/logout", (req, res) => {
  const dateTime = new Date();
  db.insertToken(req.headers["x-access-token"], dateTime);
  res
    .status(200)
    .json({
      message: "Logout efetuado!",
    })
    .end();
});

app.get("/", (req, res) => {
    res.send("Conseguiu acessar a raiz.",);
});



app.use('/user', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));
app.use('/nutrition',verifyJWT, createProxyMiddleware({ target: 'http://localhost:3002', changeOrigin: true }));
app.use('/retail', createProxyMiddleware({ target: 'http://localhost:3003', changeOrigin: true }));
app.use('/product', createProxyMiddleware({ target: 'http://localhost:3007', changeOrigin: true }));


app.listen(3000, () => {
  console.log('API Gateway running on port 3000');

  // Start User Service
  const userService = require('./user-service/user-service');
  userService.start();

  // Start Nutrition Service
  const nutritionService = require('./nutrition-service/nutrition-service');
  nutritionService.start();

  // Start Retail Service
  const retailService = require('./retail-service/retail-service');
  retailService.start();

  const productService = require('./product-service/product-service');
  productService.start();
});

