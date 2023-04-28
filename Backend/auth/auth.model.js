const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    psw: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true //para guardar la fecha de creación
});

module.exports = userSchema;