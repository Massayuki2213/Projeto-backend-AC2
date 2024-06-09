const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    descricao: {
        type: String,
        required: true,
    },
    dono: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
});

module.exports = mongoose.model('Task', TaskSchema);
