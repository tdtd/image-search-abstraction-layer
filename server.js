var express = require('express');
var app = express();
var path = require('path');
var Promise = require("bluebird");
var imgAbs = require('./lib/imgabs.js');

var port = process.env.PORT || 3500;

app.use(express.static(path.resolve(__dirname, 'client')));

/*
*		Init
*/
imgAbs.getSearch()
	.then(function(val){
		imgAbs.recentSearches = val;
		console.log(imgAbs);
	})
	.catch(function(err){
		console.log(err);
	})


app.route('/recent/')
	.get(function(req, res){
	imgAbs.getSearch()
		.then(function(val){
			res.send(val);
		})
		.catch(function(err){
			console.log(err);
		})
	});

app.route('/:term')
	.get(function(req, res){
		var offset = req.query.offset || 0;
	if (req.params.term != undefined){
		imgAbs.getImages(req.params.term, req.query.offset)
			.then(function(body){
				imgAbs.updateRecent(req.params.term);
				res.send(body);
			})
			.catch(function(err){
				console.log(err);
			})
		}
	});


app.listen(port);
console.log('server is running');


