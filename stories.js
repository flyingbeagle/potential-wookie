var program = require('commander'),
    common = require('./common.js'),
    config = common.config(),
    options = [];

program
    .version('0.1.0')
    .option('--c, --count', 'Count URLs')
    .option('--v, --verbose','Show full URL')
    .parse(process.argv);

console.log(config.rssFile);

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

var i = 0,
    sites = [];
feedparser.on('readable', function(){
    var stream = this,
        meta = this.meta,
        item;
        
    while (item = stream.read()){
       var source = item['rss:description']['#'];
       var links = $('a', source).attr('href');
       i++;
       sites.push(URL(links, true).host);
       if (program.verbose) console.log(links);
    }    
});

feedparser.on('end', function(){
    console.log('story count = ' + i);
    console.log('');
    var simple = rank(sites);
    var array = makeArray(simple);
   
    if (program.count) console.log(array.sort(function(a,b){return b.count - a.count}));
});

// tally up the array by count
function rank(array){
    var result = array.reduce(function(p, c){
        if (c in p) {
           p[c]++;
        } else {
            p[c]=1;
        }
        return p;
    }, {});

    return result;
}

// return an array from an object
function makeArray(obj){
    var arr = [];
    for (var a in obj){
        arr.push({'site': a, 'count': obj[a] });
    }
    return arr;
}
