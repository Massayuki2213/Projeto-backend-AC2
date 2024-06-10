const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middlewares/authentication');
const TaskModel = require('../../models/todolist'); // Certifique-se de que este caminho esteja correto
const express = require('express');
const task = express.Router();
const { v4: uuidv4 } = require('uuid');


// Rota para listar as tarefas do usuário logado
task.get('/tarefas', auth, async (req, res) => {
    try {
        const task = await TaskModel.find({ dono: req.user.id });
        return res.status(200).json(task);
    } catch (error) {
        return res.status(500).json({ error });
    }
});

// Rota para criar uma nova tarefa
task.post('/tarefas', auth, async (req, res) => {
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
task.put('/tarefas/:id', auth, async (req, res) => {
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
task.delete('/tarefas/:id', auth, async (req, res) => {
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
task.get('/tarefasSemDono', auth, async (req, res) => {
    try {
        const tarefas = await TaskModel.find({ dono: null });
        return res.status(200).json(tarefas);
    } catch (error) {
        return res.status(500).json({ error });
    }
});

// Rota para adicionar um dono a uma tarefa específica
task.put('/tarefas/:id/adicionarDono', auth, async (req, res) => {
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

module.exports = task;