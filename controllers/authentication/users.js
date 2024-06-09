const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middlewares/authentication');
const UserModel = require('../../models/user');
const TaskModel = require('../../models/task'); // Certifique-se de que este caminho esteja correto
const express = require('express');
const userController = express.Router();
const { v4: uuidv4 } = require('uuid');

// Conversor de funções
const funcoes = {
    1: 'Engenheiro de FE',
    2: 'Engenheiro de BE',
    3: 'Analista de dados',
    4: 'Líder Técnico',
};

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

// Rota para criar um novo usuário (não autenticada)
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
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ mensagem: 'Login realizado com sucesso', token });
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

// Rotas para tarefas autenticadas

// Rota para listar as tarefas do usuário logado
userController.get('/tarefas', auth, async (req, res) => {
    try {
        const tarefas = await TaskModel.find({ dono: req.user.id });
        return res.status(200).json(tarefas);
    } catch (error) {
        return res.status(500).json({ error });
    }
});

// Rota para criar uma nova tarefa
userController.post('/tarefas', auth, async (req, res) => {
    const { descricao } = req.body;
    const tarefa = {
        descricao,
        dono: req.user.id,
    };

    try {
        await TaskModel.create(tarefa);
        return res.status(201).json({ mensagem: 'Tarefa criada com sucesso!' });
    } catch (error) {
        return res.status(500).json({ error });
    }
});

// Rota para editar uma tarefa específica do usuário logado
userController.put('/tarefas/:id', auth, async (req, res) => {
    const tarefaId = req.params.id;
    const { descricao } = req.body;

    try {
        const tarefa = await TaskModel.findOne({ _id: tarefaId, dono: req.user.id });
        if (!tarefa) {
            return res.status(404).json({ mensagem: 'Tarefa não encontrada' });
        }

        tarefa.descricao = descricao;
        await tarefa.save();

        return res.status(200).json({ mensagem: 'Tarefa atualizada com sucesso!' });
    } catch (error) {
        return res.status(500).json({ error });
    }
});

// Rota para excluir uma tarefa específica do usuário logado
userController.delete('/tarefas/:id', auth, async (req, res) => {
    const tarefaId = req.params.id;

    try {
        const tarefa = await TaskModel.findOne({ _id: tarefaId, dono: req.user.id });
        if (!tarefa) {
            return res.status(404).json({ mensagem: 'Tarefa não encontrada' });
        }

        await tarefa.remove();
        return res.status(200).json({ mensagem: 'Tarefa removida com sucesso!' });
    } catch (error) {
        return res.status(500).json({ error });
    }
});

// Rota para trazer as tarefas que não possuem um dono
userController.get('/tarefasSemDono', auth, async (req, res) => {
    try {
        const tarefas = await TaskModel.find({ dono: null });
        return res.status(200).json(tarefas);
    } catch (error) {
        return res.status(500).json({ error });
    }
});

// Rota para adicionar um dono a uma tarefa específica
userController.put('/tarefas/:id/adicionarDono', auth, async (req, res) => {
    const tarefaId = req.params.id;

    try {
        const tarefa = await TaskModel.findById(tarefaId);
        if (!tarefa) {
            return res.status(404).json({ mensagem: 'Tarefa não encontrada' });
        }

        tarefa.dono = req.user.id;
        await tarefa.save();

        return res.status(200).json({ mensagem: 'Dono adicionado à tarefa com sucesso!' });
    } catch (error) {
        return res.status(500).json({ error });
    }
});

module.exports = userController;
