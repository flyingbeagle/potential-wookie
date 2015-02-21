var common = require('./common.js');
var config = common.config();

console.log(config.rssFile);

var options = [];

var FeedParser = require('feedparser'),
    request = require('request'),
    $ = require('cheerio');

var req = request(config.rssFile),
    URL = require('url-parse'),
    feedparser = new FeedParser([options]);
    
req.on('error', function(error){
   console.log('request ERR: ' + error); 
});

req.on('response', function(res){
   var stream = this;
   if (res.statusCode != 200) 
            return this.emit('error', new Error('Bad status code'));
            stream.pipe(feedparser);
});

feedparser.on('error', function(error){
     console.log('request ERR: ' + error); 
});

var i = 0;
feedparser.on('readable', function(){
    var stream = this,
        meta = this.meta,
        item;
        
    while (item = stream.read()){
       // console.log(item);
       var source = item['rss:description']['#'];
       var links = $('a', source).attr('href');
       i++;
       console.log(links);
    }    
});

feedparser.on('end', function(){
    console.log('story count = ' + i);
});