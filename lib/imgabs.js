var Bing = require('node-bing-api')({ accKey: "OPSkV/YpDXx5OqqMnJ25K46smphN6p90ym5HD1GQ+i4" });
var fs = require("fs");
var Promise = require("bluebird");

Promise.promisifyAll(fs);

function BingSearch (){
	this.recentSearches = [];
}

BingSearch.prototype.getImages = function(term, pagination){
	var skipPg = 0;

	if (pagination != undefined){
		skipPg = pagination;
	}
	return new Promise(function(resolve, reject){
		Bing.images(term, {
			top: 10,
			skip: skipPg
		}, function(error, res, body){
			if (error) {
				reject(error);
			} else {
				var entries = body.d.results.map(function(entry){
					return formatJSON(entry);
				});
				resolve(entries);
			}
		})
	})
}

BingSearch.prototype.updateRecent = function(search){
	var searchObj = {
		"term": search,
		"when": new Date()
	}
	
	if (this.recentSearches.length >= 10){
		this.recentSearches.pop();
	}
	
	this.recentSearches.unshift(searchObj);
	this.saveSearch();
}

BingSearch.prototype.saveSearch = function(){
	var json = JSON.stringify(this.recentSearches);
	fs.writeFileAsync("data/recent.json", json)
		.then(function(val){
			console.log('success');
		})
		.catch(function(err){
			console.log('failed');
		})
}	

BingSearch.prototype.getSearch = function(){
	return fs.readFileAsync("data/recent.json").then(JSON.parse).then(function (val) {
		return val;
	})
}

function formatJSON(entry){
	var obj = {
		imageURL: entry.MediaUrl,
		sourceURL: entry.SourceUrl,
		thumbnail: entry.Thumbnail.MediaUrl,
		altText: entry.Title,
	}
	return obj;
}

var search = new BingSearch();
module.exports = search;