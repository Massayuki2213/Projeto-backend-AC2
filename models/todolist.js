const mongoose = require('mongoose');

const task = mongoose.model("tasks", {
    tarefa: String,
    descricao: String,
    status: String,
    dono: String
});

module.exports = task;
