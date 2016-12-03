var express = require('express');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var router = express.Router();

/* GET users listing. */

router.get('/',function(req, res, next) {
	if(req.isLoggedIn)
	{
		res.render('index',{title:'Members Area',isLoggedIn:true,username:req.user.username,email:req.user.email});
	}
	else
		res.redirect('/');
});

router.get('/register',function(req,res,next){

	res.render('form',{title:'Register'});

});

router.get('/login',function(req,res,next){

	res.render('form',{title:'Login'});

});



passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new localStrategy(
	{
		usernameField : "email",
		passwordField : "password"
	},
	function(email,password,done){
	User.getByEmail(email,function(err,user){
		if(err)
			return done(err);
		if(!user){
			return done(null,false,{message:"Incorrect email"});
		}
		User.comparePassword(password,user.password,function(err,isMatch){
			if(err)
				throw err;
			if(isMatch)
				return done(null,user,{message:"You are logged in"});
			else{
				return done(null,false,{message:"invalid email or password"});
			}
		});
	});

})
);

router.post('/login' ,
	passport.authenticate('local',
		{
			failureRedirect:'/users/login',
			failureFlash:true,
			successRedirect:'/',
			successFlash:true
		}),
	function(req,res,next){
	res.redirect('/');
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


	if(req.files[0].fieldname === "profileimage"){
		var profileImageName = req.files[0].originalname;
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

			if(!err){
				req.flash('success','user registered');
				res.redirect('/');

			}
			else{
				if(err === "user exists"){
					req.flash('error','user already exists!');
					res.redirect('/users/register');
				}
				else
					throw err;
			}

		});

	}

});

router.get('/logout',function(req,res,next){

	req.logout();
	req.flash('success','You have been logged out');
	res.redirect('/');

});

module.exports = router;
