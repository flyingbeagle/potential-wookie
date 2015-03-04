var program = require('commander'),
    common = require('./common.js'),
    utility = require('./utility.js'),
    config = common.config(),
    opts = opts || [];

program
    .version('0.1.1')
    .option('--c, --count', 'Count URLs')
    .option('--v, --verbose','Show full URL')
    .option('--r, --raw','Show raw metadata')
    .option('--d, --date','Get pubdates')
    .parse(process.argv);

console.log('Reading this file: ' + config.rssFile);

var FeedParser = require('feedparser'),
    request = require('request'),
    $ = require('cheerio');

var req = request(config.rssFile),
    URL = require('url-parse'),
    feedparser = new FeedParser([opts]);
    
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
       var pubdate = meta['rss:pubdate'];
       var links = $('a', source).attr('href');
       i++;
       sites.push(URL(links, true).host);
       if (program.raw) console.log(item);
       if (program.verbose) console.log(links);
       if (program.date) console.log(item['rss:pubdate']['#']);
    }    
});

feedparser.on('end', function(){
    console.log('holding %s weeks worth of stories' , i);
    console.log('');
    var simple = utility.rank(sites);
    var array = utility.makeArray(simple);
   
    if (program.count) console.log(array.sort(function(a,b){return b.count - a.count}));
});

