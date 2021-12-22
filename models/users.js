const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String 
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);