var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.isAuthenticated()){
		res.render('index', { title: 'Home' ,isLoggedIn:req.isLoggedIn, username:req.user.username, email:req.user.email});
	}
	else
		res.render('index',{title:'Home',isLoggedIn:req.isLoggedIn});
});

module.exports = router;
