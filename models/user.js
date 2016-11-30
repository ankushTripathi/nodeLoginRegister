var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/nodeAuth');

var db = mongoose.connection;

var userSchema = new mongoose.Schema({

	username: {
		type: String,
		index: true
	},
	email: String,
	password: String,
	profileImage: String

});

var User = module.exports = mongoose.model('User',userSchema);

module.exports.createUser = function(newUser,callback) {
	bcrypt.hash(newUser.password,10,function(err,hash){
		if(err)
			throw err;
		else{
			newUser.password = hash;
			newUser.save(callback);
		}

	});
}

