require('dotenv').config()
var fs = require( 'fs' );

var express = require('express');
var app = express();
var path = require('path');
var router = express.Router();

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req,res,next) {
  // console.log("/" + req.method);
  next();
});

router.get('/', (req, res) => {
	res.render('index', {title: 'AWS TEST', text: 'welcome to my AWS!'});
})

router.get('/:asin', (req, res) => {
	const {OperationHelper} = require('./lib/apac'); 

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
		// fs.writeFileSync( './result.json', JSON.stringify(response.result, null, '    ') );
		if(response.result['ItemLookupResponse']['Items']['Item']['Offers']['Offer'])
		{
			res.render('test', {
								title: 'Info',
								info_title: response.result['ItemLookupResponse']['Items']['Item']['ItemAttributes']['Title'], 
								info_image: response.result['ItemLookupResponse']['Items']['Item']['LargeImage']['URL'],
								info_price: response.result['ItemLookupResponse']['Items']['Item']['Offers']['Offer']['OfferListing']['Price']['FormattedPrice']
								});
		}
		else
		{
			res.render('test', {
								title: 'Info',
								info_title: response.result['ItemLookupResponse']['Items']['Item']['ItemAttributes']['Title'], 
								info_image: response.result['ItemLookupResponse']['Items']['Item']['LargeImage']['URL']
								});
		}
	   	
	   						
	}).catch((err) => {
		res.render('404', {title: 'Error', text: 'ASIN code is not correct!'});
	    //console.error("Something went wrong! ", err);
	});
})

app.use('/', router);

app.listen(3000);



app.get('/normal/*', function (req, res) {
  var str = req.query.urls;
  var urls = str.split(",");

  // console.log(str);
  // renderviews(urls);


  function renderviews(urls, callback) {
    async.eachSeries(urls, function(url, callback) {
      runHorseman(url, function(){
        //store views data to templist.
        // var array = [];
        //   calendars.forEach(function(item) {
        //       array.push(item.id);
        //   });

          console.log(array);
        callback();
      })
    }), function () {
              res.render('video', {
                        title: 'video list',
                       
                        });
            }
      callback()
    }


  function runHorseman(url) {
    horseman.open('http://tools.dojoapp.co/fb_videos.php?urls='+url)
    .wait(3000)
    .switchToFrame(0)
    .html()
    .then(function(html) {
      if(html.match(/([0-9,]*) views/i)) {
        var theviews = parseInt(html.match(/([0-9,]*) views/i)[1].replace(/,/ig,''));
        var date = new Date();
        console.log(date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + url + ' ' + theviews);
        res.json({views:theviews})
      } else if (html.match(/unavailable/i)){
        res.json({views:null})
      } else {
        res.json({views:0})
      }
    })
    // console.log(req.query.urls) 
    .catch(function(e){
      console.log(e)
    })
  }
  runHorseman(req)
})