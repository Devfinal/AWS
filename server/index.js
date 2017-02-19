var express = require('express')
var router = express.Router()

router.use(function timeLog(req, res, next) {
	console.log('Time: ', Date.now())
	next()
})

router.route('/')
	.get((req, res) => {
	res.render('index', {title: 'AWS TEST', text: 'Welcome!'});
	console.log(req.url);
})

module.exports = router