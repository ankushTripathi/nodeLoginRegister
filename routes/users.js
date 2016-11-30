var express = require('express');
var User = require('../models/user');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register',function(req,res,next){

	res.render('form',{title:'Register'});

});

router.get('/login',function(req,res,next){

	res.render('form',{title:'Login'});

});

router.post('/register',function(req,res,next){

	var username = req.body.username;
	var email = req.body.email;
	var password1 = req.body.password1;
	var password2 = req.body.password2;

	//form validation
	req.checkBody('username','username is required').notEmpty();
	req.checkBody('email',' valid email is required').notEmpty().isEmail();
	req.checkBody('password1','password is required').notEmpty();
	req.checkBody('password2','passwords should match').equals(req.body.password1);

	if(req.files.profileImage){
		console.log('uploading file ....');
		var profileImageName = req.files.profileImage.name;
	}else
		var profileImageName = 'noimage.jpg';

	var errors = req.validationErrors();

	if(errors){
		res.render('form',
			{
				title : 'Register',
				errors : errors,
				username : username,
				email : email,
				password1 : password1,
				password2 : password2
		});
	}
	else{

		//create user
		var newUser = new User({

			username: username,
			email: email,
			password:password1,
			profileImage: profileImageName

		});

		User.createUser(newUser,function(err,result){

			if(err)
				throw err;
			else
				console.log(result);

		});

		//flash msg
		req.flash('success','you have been registered!');
		res.location('/');
		res.redirect('/');

	}

});

module.exports = router;
