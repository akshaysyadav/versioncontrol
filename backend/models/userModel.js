const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  repositories: [{ type: Schema.Types.ObjectId, ref: 'Repository' }],
  followusers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  starRepositorys: [{ type: Schema.Types.ObjectId, ref: 'Repository' }],
});

const User = mongoose.model('User', userSchema);
module.exports = User;