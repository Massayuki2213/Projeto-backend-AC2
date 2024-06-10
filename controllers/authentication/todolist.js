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
task.post("/tarefas", auth, async (req, res) => {
    const { descricao, status, dono } = req.body;

    try {
        const novaTarefa = await TaskModel.create({
            descricao: descricao,
            status: status,
            dono: dono // não há necessidade de definir como null, já que é opcional
        });

        return res.status(201).json({ mensagem: 'Tarefa criada com sucesso!', novaTarefa });
    } catch (error) {
        return res.status(500).json({ error: "Erro " });
    }
});




// Rota para editar uma tarefa específica do usuário logado
task.put("/editar/:Id", auth, async (req, res) => {
    const { id } = req.params;
    const tarefaUpdates = req.body;
  
    try {
      const tarefa = await TaskModel.findOne({ id: id });
  
      if (!tarefa) {
        return res.status(404).json({ mensagem: "Tarefa não encontrada" });
      }
  
      await TaskModel.updateOne({ id: id }, tarefaUpdates);
  
      const updatedTarefa = await TaskModel.findOne({ id: id });
  
      return res.status(200).json(updatedTarefa);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

// Rota para excluir uma tarefa específica do usuário logado
task.delete("/:id", auth, async (req, res) => {
    const id = req.params.id;
    try {
        const task = await TaskModel.findOneAndDelete({ _id: id });
        if (!task) {
            return res.status(404).json({ mensagem: "Tarefa não encontrada!" });
        }
        return res.status(200).json({ mensagem: "Tarefa excluída com sucesso!" });
    } catch (err) {
        return res.status(500).json({ mensagem: "Erro ao excluir tarefa!" });
    }
});

// Rota para trazer as tarefas que não possuem um dono
task.get('/tarefassemdono', auth, async (req, res) => {
    try {
        const tarefas = await TaskModel.find({ dono: null });
        return res.status(200).json(tarefas);
    } catch (error) {
        return res.status(500).json({ error });
    }
});

// Rota para adicionar um dono a uma tarefa específica
task.put("/tarefas/:taskId/:userId", auth, async (req, res) => {
    const { taskId, userId } = req.params;
    try {
        const task = await TaskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({ mensagem: "Tarefa não encontrada!" });
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ mensagem: "Usuário não encontrado!" });
        }
        task.userId = user._id;
        await task.save();
        return res.status(200).json({ mensagem: "Usuário atribuído a tarefa com sucesso!", task });
    } catch (err) {
        return res.status(500).json({ error: "Não foi possível atribuir o usuário à tarefa!" });
    }
});

module.exports = task;