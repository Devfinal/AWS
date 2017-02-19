var express = require('express')
var router = express.Router()
var fs = require('fs')

router.use(function timeLog(req, res, next) {
	console.log('Time: ', Date.now())
	next()
})

router.route('/:asin')
	.get((req, res) => {
	console.log(req.url);
	const {OperationHelper} = require('../lib/apac'); 

	const opHelper = new OperationHelper({
	    awsId:     process.env.AWS_ACCESS_KEY_ID,
	    awsSecret: process.env.AWS_SECRET_KEY,
	    assocId:   process.env.AWS_ASSOCIATED_ID,
	    locale:    'DE'
	});

	var options = {
		noColor: true
	};

	opHelper.execute('ItemLookup', {
	  'ItemId': req.params.asin,
	  'ResponseGroup': 'ItemAttributes, Offers, Images'
	}).then(function (response) {
		fs.writeFileSync( './result.json', JSON.stringify(response.result, null, '    ') );
	   	res.render('test', {
								title: 'Info',
								info_title: response.result['ItemLookupResponse']['Items']['Item']['ItemAttributes']['Title'], 
								info_image: response.result['ItemLookupResponse']['Items']['Item']['LargeImage']['URL'],
								info_price: response.result['ItemLookupResponse']['Items']['Item']['Offers']['Offer']['OfferListing']['Price']['FormattedPrice']
	   						});
	}).catch((err) => {
	    console.error("Something went wrong! ", err);
	});
})

module.exports = router