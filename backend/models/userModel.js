const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dp: {type: String, required: true, default: 'http://localhost:3000/images/default.jpg'}
});

userSchema.plugin(unique);

module.exports = mongoose.model('User', userSchema);