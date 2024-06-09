const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: String,
    nome: String,
    email: String,
    senha: String,
    funcao: String
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
