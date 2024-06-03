require("dotenv").config();
const db = require("./db");
const cors = require("cors");
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');

// console.log(db);


app.use(cors());
// body parsing, analizar o corpo
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



/** ---- x ---- */


/** pacientes  */

// app.get("/patients", async (req, res) => {
//     try {
//       const results = await db.selectPatients();
//       res.status(200).json({
//         message: "Pacientes obtidos com sucesso!",
//         results,
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({
//         message: "Error ao obter clientes.",
//       });
//     }
// });

//  inserindo dados no db
// app.post("/patients", async (req, res) => {
//     const patient = req.body;
//     console.log("Patient: ", patient);
//     try {
//       await db.insertPatient(patient);
//       res.status(201).json({
//         message: "Paciente inserido com sucesso!",
//       });
//     } catch (error) {
//       res.status(500).json({
//         message: "Error ao inserir o paciente.",
//       });
//     }
// });




/** ----- x-  ----- */
// app.get("/patients", async (req, res) => {
//     console.log(req.userId + " fez esta chamada!");
//     try {
//       const results = await db.selectPatients();
//       res.status(200).json({
//         message: "Pacientes obtidos com sucesso!",
//         results,
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({
//         message: "Error ao obter clientes.",
//       });
//     }
// });



// diferença de put vs patch
// put - atualiza a entidade inteira.
// patch - atualiza os campos.

// app.patch("/clientes/:id", async (req, res) => {
//   const id = parseInt(req.params.id);
//   const customer = req.body;
//   try {
//     await db.updateCustomer(id, customer);
//     res.status(200).json({
//       message: "Cliente editado com sucesso!",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error ao editar cliente.",
//     });
//   }
// });

// app.delete("/clientes/:id", async (req, res) => {
//   const id = parseInt(req.params.id);
//   try {
//     await db.deleteCustomer(id);
//     res.status(204).json({
//       message: "Cliente deletado com sucesso!",
//     });
//   } catch (e) {
//     res.status(500).json({
//       message: "Error ao deletar cliente.",
//     });
//   }
// });

//  obtendo todos os dados do db
// app.get("/clientes", verifyJWT, async (req, res) => {
//   console.log(req.userId + " fez esta chamada!");
//   try {
//     const results = await db.selectCustomers();
//     res.status(200).json({
//       message: "Clientes obtidos com sucesso!",
//       results,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Error ao obter clientes.",
//     });
//   }
// });

//  inserindo dados no db
// app.post("/clientes", async (req, res) => {
//   const customer = req.body;
//   console.log("Customer: ", customer);
//   try {
//     await db.insertCustomer(customer);
//     res.status(201).json({
//       message: "Cliente inserido com sucesso!",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error ao inserir o cliente",
//     });
//   }
// });

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
// app.post("/login", async (req, res) => {
//   // aqui vou no banco verifico se existe e entro no if
//   const { usuario, senha } = req.body;

//   const results = await db.selectUserForLogin(usuario, senha);
//   console.log(results, "results para userID");
//   if (results.length > 0) {
//     const token = jwt.sign({ userId: 1 }, process.env.SECRET, {
//       expiresIn: 300,
//     });
//     return res.status(200).json({
//       auth: true,
//       token,
//       message: "Login efetuado com sucesso!",
//     });
//   }
//   res.status(401).json({ message: "Não foi possivel efetuar o login. " }).end();
//   return results;
// });

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

// obtendo dado especifico do db
// app.get("/clientes/:id", async (req, res) => {
//   const id = parseInt(req.params.id);
//   try {
//     const results = await db.selectCustomer(id);
//     res.json({
//       message: "Cliente obtido com sucesso!",
//       results,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error ao obter cliente.",
//     });
//   }
// });

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

