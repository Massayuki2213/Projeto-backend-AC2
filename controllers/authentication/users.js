const bcryptjs = require("bcryptjs");
const auth = require("../../middlewares/authentication"); // middleware para rotas autenticadas
const User = require("../../models/User");
const express = require("express");
const users = express.Router();
const { v4: uuidv4 } = require('uuid');

// Conversor
const funcoes = {
  1: "Engenheiro de FE",
  2: "Engenheiro de BE",
  3: "Analista de dados",
  4: "Líder Técnico",
};

// Rotas não autenticadas:

// Rota para criar um novo usuario/cliente
users.post("/cadastro", async (req, res) => {
    const { nome, email, senha } = req.body;

    const usuarioExistente = await User.findOne({
      $or: [{ nome: nome }, { email: email }],
    });
    if (usuarioExistente) {
      return res.status(400).json({
        mensagem: "Nome de usuário ou email já existe!",
      });
    }

    const senhaEncrypt = await bcryptjs.hash(senha, 10);
    var newUser = {
      id: uuidv4(),
      nome: nome,
      email: email,
      senha: senhaEncrypt,
      funcao: null,
    };

    try {
      await User.create(newUser);
      return res.status(201).json({
        mensagem: "Usuário criado com sucesso!",
      });
    } catch (error) {
      return res.status(500).json({
        error: error,
      });
    }
});

// Rotas autenticadas:

// Rota para obter todos os usuario
users.get("/users", auth, async (req, res) => {
  try {
    let users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    console.log(`Erro ao buscar usuários. ${err}`);
    return res.status(500).json({ error: err });
  }
});

// Rota para obter user por funcao
users.get("/usuariosPorFuncao", auth, async (req, res) => {
  try {
    const usuariosPorFuncao = await User.aggregate([
      {
        $group: {
          _id: "$funcao",
          total: { $sum: 1 },
        },
      },
    ]);

    const totalUsuarios = await User.countDocuments();

    return res.status(200).json({ usuariosPorFuncao, totalUsuarios });
  } catch (error) {
    console.log(`Erro ao buscar usuários por função. ${error}`);
    return res.status(500).json({ error: error });
  }
});

// Rota para obter um user pelo email
users.get("/:email", auth, async (req, res) => {
  var email = req.params.email;

  try {
    let user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ mensagem: "Usuário não encontrado /:email" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.log(`Um erro ocorreu ao buscar usuários. ${err}`);
    return res.status(500).json({ error: err });
  }
});

users.delete("/:idUser", auth, async (req, res) => {
  const idUser = req.params.idUser; // Captura o idUser
  try {
    const user = await User.findOne({ idUser: idUser });

    if (!user) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    await User.findOneAndDelete({ idUser: idUser });

    return res.status(200).json({ mensagem: "Usuário deletado com sucesso" });
  } catch (err) {
    console.error(`Um erro ocorreu ao deletar o usuário. ${err}`);
    return res.status(500).json({ error: err });
  }
});

// Rota autenticada para cadastro de usuários
users.post("/cadastroUsuario", auth, async (req, res) => {
    const { nome, email, senha, funcao } = req.body;

    const usuarioExistente = await User.findOne({
      $or: [{ nome: nome }, { email: email }],
    });
    if (usuarioExistente) {
      return res.status(400).json({
        mensagem: "Nome de usuário ou email já existe!",
      });
    }

    const senhaEncrypt = await bcryptjs.hash(senha, 10);
    const funcaoNome = funcoes[funcao]; // Obtém o nome da funcao com base no number recebido

    if (!funcaoNome) {
      return res.status(400).json({
        mensagem: "Função inválida!",
      });
    }

    const newUser = {
      id: uuidv4(),
      nome: nome,
      email: email,
      senha: senhaEncrypt,
      funcao: funcaoNome,
    };

    try {
      await User.create(newUser);
      return res.status(201).json({
        mensagem: "Usuário criado com sucesso!",
      });
    } catch (error) {
      return res.status(500).json({
        error: error,
      });
    }
});

// Rota para editar usuario:
users.put("/editarUsuario/:email", auth, async (req, res) => {
  const userEmail = req.params.email;
  const { nome, email, senha, funcao } = req.body;

  try {
    // Verifica se o usuário existe através do email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    // Atualiza os campos do usuário
    if (nome) user.nome = nome;
    if (email) user.email = email;
    if (senha) {
      const senhaEncrypt = await bcryptjs.hash(senha, 10);
      user.senha = senhaEncrypt;
    }
    if (funcao) {
      const funcaoNome = funcoes[funcao];
      if (!funcaoNome) {
        return res.status(400).json({ mensagem: "Função inválida" });
      }
      user.funcao = funcaoNome;
    }

    // Salva as alterações
    await user.save();

    return res.status(200).json({ mensagem: "Usuário atualizado com sucesso" });
  } catch (error) {
    console.error(`Um erro ocorreu ao editar o usuário. ${error}`);
    return res.status(500).json({ error: error });
  }
});

module.exports = users;
