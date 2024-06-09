const mongoose = require('mongoose');

const User = mongoose.model("users", {
    id: String,
    nome: String,
    email: String,
    senha: String,
    funcao: String
});

module.exports = User;
