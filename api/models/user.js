const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'O nome do usuário é requerido']
  },
  email: {
    type: String,
    required: true,
    unique: [true, 'O e-mail já está sendo utilizado']
  },
  password: {
    type: String,
    required: [true, 'O campo senha é obrigatório']
  }
});

module.exports = mongoose.model("users", userSchema);
