const bcryptjs = require('bcryptjs');
const auth = require('../../middlewares/authentication');
const UserModel = require('../../models/user');
const express = require('express');
const userController = express.Router();

// Rota para listar os usuários
userController.get('/', auth, async (req, res) => {
    try {
        let users = await UserModel.find();
        return res.status(200).json(users);
    } catch (err) {
        console.log(`Um erro ocorreu ao buscar usuários. ${err}`);
        return res.status(500).json({ error: err });
    }
});

// Rota para obter um usuário específico por email
userController.get('/:email', auth, async (req, res) => {
    var email = req.params.email;

    try {
        let user = await UserModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        return res.status(200).json(user);
    } catch (err) {
        console.log(`Um erro ocorreu ao buscar usuários. ${err}`);
        return res.status(500).json({ error: err });
    }
});

// Rota para criar um novo usuário
userController.post('/', async (req, res) => {
    const { nome, email, senha } = req.body;
    const senhaEncrypt = await bcryptjs.hash(senha, 10);
    var user = {
        nome: nome,
        email: email,
        senha: senhaEncrypt,
    };

    try {
        await UserModel.create(user);
        return res.status(201).json({
            mensagem: 'Usuário criado com sucesso!',
        });
    } catch (error) {
        return res.status(500).json({
            error: error,
        });
    }
});

// Rota de login
userController.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        let user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        const isMatch = await bcryptjs.compare(senha, user.senha);
        if (!isMatch) {
            return res.status(400).json({ mensagem: 'Senha incorreta' });
        }

        // Gerar token de autenticação aqui se estiver usando JWT ou outro método de autenticação
        return res.status(200).json({ mensagem: 'Login realizado com sucesso' });
        
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

// Rota para editar um usuário específico
userController.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    try {
        let user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        user.nome = nome || user.nome;
        user.email = email || user.email;
        if (senha) {
            user.senha = await bcryptjs.hash(senha, 10);
        }

        await user.save();
        return res.status(200).json({ mensagem: 'Usuário atualizado com sucesso' });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

// Rota para excluir um usuário específico
userController.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;

    try {
        let user = await UserModel.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        return res.status(200).json({ mensagem: 'Usuário excluído com sucesso' });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

// Rota para trazer a quantidade de usuários separados por função
userController.get('/count/by-role', auth, async (req, res) => {
    try {
        let feCount = await UserModel.countDocuments({ funcao: 'Engenheiro de FE' });
        let beCount = await UserModel.countDocuments({ funcao: 'Engenheiro de BE' });
        let daCount = await UserModel.countDocuments({ funcao: 'Analista de dados' });
        let ltCount = await UserModel.countDocuments({ funcao: 'Líder Técnico' });

        return res.status(200).json({
            'Engenheiro de FE': feCount,
            'Engenheiro de BE': beCount,
            'Analista de dados': daCount,
            'Líder Técnico': ltCount,
        });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

module.exports = userController;
