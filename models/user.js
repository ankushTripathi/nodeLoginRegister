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

	User.findOne({$or:[{username:newUser.username},{email:newUser.email}]},function(err,user){

		if(err)
			throw err;
		else{
			if(!user){
				
				bcrypt.hash(newUser.password,10,function(err,hash){
				if(err)
					throw err;
				else{
					newUser.password = hash;
					newUser.save(callback);
				}

			});
		}
		else{
			callback("user exists",null);
		}
	}

});	
}

module.exports.getByEmail = function(email,callback){
	User.findOne({email:email},'password',callback);
}


module.exports.getById = function(id,callback){
	User.findById(id,'username email',callback);
}

module.exports.comparePassword = function(inputPassword,hash,callback){
	bcrypt.compare(inputPassword,hash,function(err,isMatch){
		if(err)
			return callback(err);
		return callback(null,isMatch);
	});
}