const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    descricao: String,
    status: String,
    dono: { type: String, required: false } // tornando o campo dono opcional
});

const task = mongoose.model("tasks", taskSchema);

module.exports = task;
