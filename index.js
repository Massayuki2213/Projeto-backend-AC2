const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
 const login = require("./controllers/login");
 const users = require("./controllers/authentication/users");
 const task= require("./controllers/authentication/todolist"); 
dotenv.config();

const server = express();

// Middleware para processar o corpo das solicitações como JSON
server.use(express.json());

server.use("/login", login);
server.use("/users", users);
server.use("/todolist", task); // Rota para as tarefas 

const PORT = process.env.PORT
const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS

const DB_URL = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.upsthkg.mongodb.net/${DB_NAME}`;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Banco de dados conectado com sucesso");
    server.listen(PORT, () => {
      console.log(`server rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Erro ao conectar no banco de dados. ${error}`);
  });
