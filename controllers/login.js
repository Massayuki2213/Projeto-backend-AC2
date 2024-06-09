const UserModel = require("../models/user")
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const express = require('express')

const loginController = express.Router()

loginController.post("/", async (req, res) => {

    const { email, senha } = req.body

    var user = await UserModel.findOne({email: email})
    if(!user) {
        return res.status(400).json({mensagem: "Usuário não encontrado"})
    }

    if(await bcryptjs.compare(senha, user.senha)) {
        const token = jwt.sign({ nome: user.nome, email: user.email}, process.env.JWT_SECRET, { expiresIn: '2d' })

        return res.status(200).json({
            mensagem: "Usuario logado com sucesso!",
            token: token
        })
    } else {
        return res.status(401).json({mensagem: "Email ou senha inválidos"})
    }

})

module.exports = loginController